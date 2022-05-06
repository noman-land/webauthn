import Router from '@tsndr/cloudflare-worker-router';

import {
  registrationChallengeHandler,
  registrationVerificationHandler,
} from './handlers.js';

const router = new Router();

router
  .cors({
    allowOrigin: 'https://noman.land',
  })
  .use((_, res, next) => {
    res.headers.set('advanced-stealth', 'very');
    next();
  })
  .get('', (_, res) => (res.body = 'OK'))
  .get('/token', registrationChallengeHandler)
  .put('/token', registrationVerificationHandler)
  .delete('/token', (_, res) => (res.status = 501));

addEventListener('fetch', event => {
  event.respondWith(router.handle(event.request));
});
