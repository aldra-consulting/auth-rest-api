const crypto = require('crypto');

crypto.randomBytes(48, (_, buffer) =>
  console.log(JSON.stringify([buffer.toString('hex')], null, 2))
);
