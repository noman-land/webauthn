import { Hono } from 'hono';

// import { registrationVerificationHandler } from './handlers';
import { JsonResponse, randomBytes } from './utils';
import type { HonoTypes } from './types';

// const addCorsHeaders = (response: Response) => {
//   response.headers.set('Access-Control-Allow-Origin', '*');
//   response.headers.set(
//     'Access-Control-Allow-Methods',
//     'GET, POST, PUT, DELETE, OPTIONS'
//   );
//   response.headers.set(
//     'Access-Control-Allow-Headers',
//     'authorization, referer, origin, content-type'
//   );
//   response.headers.set('Access-Control-Max-Age', '3600');

//   return response;
// };

export default new Hono<HonoTypes>({ strict: false })
  .basePath('/u2f/v1')
  // .use(
  //   session({
  //     secret: 'nsignasdndsrlal0jr9ng4akjrn3gekjr9bng0as4hljdif2bnas7o8gb5ns3k2',
  //     saveUninitialized: true,
  //     cookie: {
  //       maxAge: 1000 * 60 * 60 * 24,
  //       secure: true
  //     },
  //     resave: false,
  //   })
  // )
  // .use(bodyParser.json())
  // .use(bodyParser.urlencoded({ extended: true }))
  .options('*', () => new Response(null, { status: 204 }))
  .get('', () => new Response('Ok'))
  .get('/token', (c) => {
    return new JsonResponse({
      version: 'U2F_V2',
      appId: c.env.APP_ID,
      challenge: randomBytes(32),
    });
  })
  // .put('/token', registrationVerificationHandler)
  .delete('/token', () => new Response(null, { status: 501 }));
