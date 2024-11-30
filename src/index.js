import { Router } from 'itty-router';

import {
  registrationChallengeHandler,
  registrationVerificationHandler,
} from './handlers.js';

const addCorsHeaders = response => {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  );
  response.headers.set(
    'Access-Control-Allow-Headers',
    'authorization, referer, origin, content-type'
  );
  response.headers.set('Access-Control-Max-Age', '3600');

  return response;
};

const router = Router({ base: '/u2f/v1' });

router
  .options('*', () => new Response(null, { status: 204 }))
  .get('', () => new Response('Ok'))
  .get('/token', registrationChallengeHandler(router))
  .put('/token', registrationVerificationHandler(router))
  .delete('/token', () => new Response(null, { status: 501 }));

addEventListener('fetch', event => {
  event.respondWith(
    router
      .handle(event.request)
      .catch(() => new Response(null, { status: 500 }))
      .then(addCorsHeaders)
  );
});
