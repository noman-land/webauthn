// import u2f from 'u2f';
// import { JsonResponse, randomBytes } from './utils';

// export const registrationChallengeHandler = async (c) => {
//   // console.log('app1', app);
//   // console.log('app2', app.set('session', JSON.stringify(session)));
//   // console.log('app2', app.routes[app.routes.length - 1]);
//   // console.log('app2', app.set('session', JSON.stringify(session)));
//   // console.log('app2', app);

//   // 3. Send the registration request to the client, who will use the Javascript U2F API to sign
//   // the registration request, and send it back to the server for verification. The registration
//   // request is a JSON object containing properties used by the client to sign the request.

// };

// export const registrationVerificationHandler = async (c) => {
//   // const resp = await req.json();
//   // console.log('resp', resp);
//   // 'registrationRequest AND RESPONSE',
//   // registrationRequest,
//   // JSON.parse(atob(registrationResponse.clientData))
//   // );

//   // try {
//   //   // console.log('app session', app.get('session'));
//   //   // const result = u2f.checkRegistration(JSON.parse(app.get('session')), resp);
//   //   // console.log('result', result);

//   //   const response = result.successful ? {
//   //     // Success!
//   //     // Save result.publicKey and result.keyHandle to the server-side datastore, associated with
//   //     // this user.
//   //     body: result
//   //   } : {
//   //     // result.errorMessage is defined with an English-language description of the error.
//   //     status: 412,
//   //     body: result.errorMessage,
//   //   };

//   //   return new JsonResponse(response);
//   // } catch (e) {
//   //   // console.log(e);
//   //   return new JsonResponse({ status: 501 });
//   // }
// };
