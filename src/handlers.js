import u2f from 'u2f';

import { APP_ID } from './constants.js';
import { randomBytes } from './utils.js';

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

export const registrationChallengeHandler = async req => {
  const registrationRequest = u2fRequest(APP_ID);
  req.session = { registrationRequest };

  // 3. Send the registration request to the client, who will use the Javascript U2F API to sign
  // the registration request, and send it back to the server for verification. The registration
  // request is a JSON object containing properties used by the client to sign the request.
  return new Response(JSON.stringify(registrationRequest, null, 2));
};

export const registrationVerificationHandler = async req => {
  const result = u2f.checkRegistration(
    req.session.registrationRequest,
    req.body.registrationResponse
  );

  const response = {};

  if (result.successful) {
    // Success!
    // Save result.publicKey and result.keyHandle to the server-side datastore, associated with
    // this user.
    response.body = result;
    return new Response(JSON.stringify(response, null, 2));
  }

  // result.errorMessage is defined with an English-language description of the error.
  response.status = 412;
  response.body = result.errorMessage;
  return new Response(JSON.stringify(response, null, 2));
};
