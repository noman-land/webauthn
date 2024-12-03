import { Hono } from 'hono';
import { server } from '@passwordless-id/webauthn';
import type { RegistrationInfo } from '@passwordless-id/webauthn/dist/esm/types';

import { JsonResponse } from './utils';
import type {
  AuthenticationBody,
  AuthenticationChecks,
  ChallengeSession,
  HonoTypes,
  RegistrationBody,
} from './types';

export default new Hono<HonoTypes>({ strict: false })
  .basePath('/webauthn/v1')
  .use((c, next) => {
    c.res.headers.set('Access-Control-Allow-Origin', '*');
    c.res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    c.res.headers.set(
      'Access-Control-Allow-Headers',
      'authorization, referer, origin, content-type',
    );
    c.res.headers.set('Access-Control-Max-Age', '3600');
    return next();
  })
  .options('*', () => new Response(null, { status: 204 }))
  .get('', () => new Response('Ok'))
  .post('/challenge', async (c) => {
    const sessionId = crypto.randomUUID();
    const challenge = server.randomChallenge();
    const { origin } = new URL(c.req.header('Referer') || c.req.url);
    const challengeSession: ChallengeSession = {
      challenge,
      origin,
    };
    await c.env.CHALLENGES.put(sessionId, JSON.stringify(challengeSession), {
      expirationTtl: 60,
    });
    return new JsonResponse({
      sessionId,
      challenge,
    });
  })
  .put('/register', async (c) => {
    const body = await c.req.json<RegistrationBody>();
    const challengeSession = await c.env.CHALLENGES.get<ChallengeSession>(body.sessionId, {
      type: 'json',
    });

    if (!challengeSession?.challenge) {
      return new Response(
        'Challenge not found or expired. Challenges are only valid for 60 seconds.',
        { status: 404 },
      );
    }

    try {
      const registration = await server.verifyRegistration(body.registration, challengeSession);
      await c.env.CHALLENGES.delete(body.sessionId);
      await c.env.REGISTRATIONS.put(registration.credential.id, JSON.stringify(registration));
      return new JsonResponse(registration);
    } catch (e: any) {
      return new Response(`Registration failed: ${e.message}`, { status: 400 });
    }
  })
  .put('/authenticate', async (c) => {
    const body = await c.req.json<AuthenticationBody>();
    const challengeSession = await c.env.CHALLENGES.get<ChallengeSession>(body.sessionId, {
      type: 'json',
    });

    if (!challengeSession?.challenge) {
      return new Response(
        'Challenge not found or expired. Challenges are only valid for 60 seconds.',
        { status: 404 },
      );
    }

    const user = await c.env.REGISTRATIONS.get<RegistrationInfo>(body.authentication.id, {
      type: 'json',
    });

    if (!user) {
      return new Response(`User not found: ${body.authentication.id}`, { status: 404 });
    }

    const expected: AuthenticationChecks = {
      ...challengeSession,
      userVerified: user.userVerified,
    };

    try {
      await server.verifyAuthentication(body.authentication, user.credential, expected);
      return new Response(null, { status: 204 });
    } catch (e: any) {
      return new Response(`Authentication failed: ${e.message}`, { status: 400 });
    }
  })
  .delete('/register', async (c) => {
    const body = await c.req.json<AuthenticationBody>();
    const challengeSession = await c.env.CHALLENGES.get<ChallengeSession>(body.sessionId, {
      type: 'json',
    });

    if (!challengeSession?.challenge) {
      return new Response(
        'Challenge not found or expired. Challenges are only valid for 60 seconds.',
        { status: 404 },
      );
    }

    const user = await c.env.REGISTRATIONS.get<RegistrationInfo>(body.authentication.id, {
      type: 'json',
    });

    if (!user) {
      return new Response(`User not found: ${body.authentication.id}`, { status: 404 });
    }

    const expected: AuthenticationChecks = {
      ...challengeSession,
      userVerified: user.userVerified,
    };

    try {
      await server.verifyAuthentication(body.authentication, user.credential, expected);
      await c.env.REGISTRATIONS.delete(user.credential.id);
      return new Response(null, { status: 204 });
    } catch (e: any) {
      return new Response(`Authentication failed: ${e.message}`, { status: 400 });
    }
  });
