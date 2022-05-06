import u2f from 'u2f';

import { APP_ID } from './constants.js';

export const registrationChallengeHandler = async (req, res) => {
  const registrationRequest = u2f.request(APP_ID);
  req.session = { registrationRequest };

  // 3. Send the registration request to the client, who will use the Javascript U2F API to sign
  // the registration request, and send it back to the server for verification. The registration
  // request is a JSON object containing properties used by the client to sign the request.
  res.body = registrationRequest;
};

export const registrationVerificationHandler = async (req, res) => {
  const result = u2f.checkRegistration(
    req.session.registrationRequest,
    req.body.registrationResponse
  );

  if (!result.successful) {
    // Success!
    // Save result.publicKey and result.keyHandle to the server-side datastore, associated with
    // this user.
    res.body = result;
    return;
  }

  // result.errorMessage is defined with an English-language description of the error.
  res.status = 412;
  res.body = result.errorMessage;
};
