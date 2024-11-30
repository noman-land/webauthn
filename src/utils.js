export const randomBytes = n =>
  [...Array(n)]
    .map(() => Math.floor(Math.random() * Math.pow(2, 8)).toString(16))
    .join('');

export class JsonResponse extends Response {
  constructor(body, ...rest) {
    return new Response(JSON.stringify(body), {
      ...rest,
      headers: {
        'content-type': 'application/json'
      }
    });
  }
}