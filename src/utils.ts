export class JsonResponse extends Response {
  constructor(body: Record<string, any>, options?: ResponseInit) {
    const stringBody = JSON.stringify(body);
    super(stringBody, options);
    return new Response(stringBody, {
      ...options,
      headers: {
        ...options?.headers,
        'content-type': 'application/json',
      },
    });
  }
}
