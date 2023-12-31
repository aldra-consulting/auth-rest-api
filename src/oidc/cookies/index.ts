import { type Configuration } from 'oidc-provider';

import env from '@project/env';
import { isDevelopmentEnvironment } from '@project/utils/common';
import { getCookieKeys } from '@project/utils/crypto';

export default async () =>
  ({
    keys: await getCookieKeys(),
    names: {
      interaction: 'OIDC_INTERACTION',
      resume: 'OIDC_INTERACTION_RESUME',
      session: 'OIDC_SESSION',
      state: 'OIDC_STATE',
    },
    short: {
      httpOnly: true,
      overwrite: true,
      sameSite: 'none',
      signed: true,
      secure: !isDevelopmentEnvironment(),
      domain: env.COOKIE_DOMAIN_NAME,
      path: '/',
    },
    long: {
      httpOnly: true,
      overwrite: true,
      sameSite: 'none',
      signed: true,
      secure: !isDevelopmentEnvironment(),
      domain: env.COOKIE_DOMAIN_NAME,
      path: '/',
    },
  }) satisfies Configuration['cookies'];
