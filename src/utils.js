export const randomBytes = n =>
  [...Array(n)]
    .map(() => Math.floor(Math.random() * Math.pow(2, 8)).toString(16))
    .join('');
