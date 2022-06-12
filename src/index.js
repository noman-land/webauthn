import { Router } from 'itty-router';

import {
  registrationChallengeHandler,
  registrationVerificationHandler,
} from './handlers.js';

const router = Router({
  base: '/u2f/v1',
});

router
  .cors()
  .get('', () => new Response('Ok'))
  .get('/token', registrationChallengeHandler)
  .put('/token', registrationVerificationHandler)
  .delete('/token', () => new Response({ status: 501 }));

addEventListener('fetch', event => {
  event.respondWith(router.handle(event.request));
});
