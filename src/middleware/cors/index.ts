import cors from '@koa/cors';

import env from '@project/env';

import origins from '../../oidc/origins';

const { NODE_ENV: environment } = env;

export default cors({
  origin: ({ headers: { origin } }) => {
    console.log('::AZ::', { origin });
    return origin && origins()[environment].includes(origin) ? origin : '';
  },
  allowMethods: ['GET', 'POST'],
  credentials: true,
});
