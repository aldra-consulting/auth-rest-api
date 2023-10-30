import { randomBytes } from 'crypto';

import { type Middleware } from 'koa';

export default (async (ctx, next) => {
  const cspNonce = randomBytes(16).toString('hex');

  ctx.state = { ...ctx.state, ...{ cspNonce } };
  ctx.req.state = { ...ctx.req.state, ...{ cspNonce } };

  await next();
}) satisfies Middleware;
