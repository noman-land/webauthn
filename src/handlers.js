import u2f from 'u2f';

import { APP_ID } from './constants.js';
import { JsonResponse, randomBytes } from './utils.js';

const u2fRequest = (appId, keyHandle) => {
  if (typeof appId !== 'string')
    throw new Error('U2F request(): appId must be provided.');

  var res = {
    version: 'U2F_V2',
    appId: appId,
    challenge: randomBytes(32),
  };
  if (keyHandle) res.keyHandle = keyHandle;
  return res;
};

export const registrationChallengeHandler = app => async (req, res) => {
  const session = u2fRequest(APP_ID);

  // 3. Send the registration request to the client, who will use the Javascript U2F API to sign
  // the registration request, and send it back to the server for verification. The registration
  // request is a JSON object containing properties used by the client to sign the request.
  return new JsonResponse(session);
};

export const registrationVerificationHandler = app => async req => {
  const resp = await req.json();
  try {
    const result = u2f.checkRegistration(JSON.parse(app.get('session')), resp);
  } catch (e) {
    return new JsonResponse({ status: 501 });
  }

  const response = {};

  if (result.successful) {
    // Success!
    // Save result.publicKey and result.keyHandle to the server-side datastore, associated with
    // this user.
    response.body = result;
  } else {
    // result.errorMessage is defined with an English-language description of the error.
    response.status = 412;
    response.body = result.errorMessage;
  }

  return new JsonResponse(response);
};
