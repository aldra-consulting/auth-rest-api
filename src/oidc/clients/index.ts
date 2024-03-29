import { type Configuration } from 'oidc-provider';

import env from '@project/env';

const { REALM: realm } = env;

export default () =>
  [
    {
      realm,
      client_id: `${realm}.development`,
      client_secret: `${realm}.development`,
      application_type: 'web',
      grant_types: ['authorization_code', 'refresh_token'],
      scope: `openid profile`,
      redirect_uris: [
        'http://localhost:8002/auth',
        'http://localhost:8003/auth',
        'http://localhost:8004/auth',
        'http://0.0.0.0:8002/auth',
        'http://0.0.0.0:8003/auth',
        'http://0.0.0.0:8004/auth',
      ],
      post_logout_redirect_uris: [
        'http://localhost:8002',
        'http://localhost:8003',
        'http://localhost:8004',
        'http://0.0.0.0:8002',
        'http://0.0.0.0:8003',
        'http://0.0.0.0:8004',
      ],
      token_endpoint_auth_method: 'none',
      isDevelopment: true,
      isFirstParty: true,
    },
    {
      realm,
      client_id: `${realm}`,
      client_secret: `${realm}`,
      application_type: 'web',
      grant_types: ['authorization_code', 'refresh_token'],
      scope: `openid profile`,
      redirect_uris: [
        'https://www.aldra.no/auth',
        'https://www.platform.aldra.no/auth',
      ],
      post_logout_redirect_uris: [
        'https://www.aldra.no',
        'https://www.id.aldra.no/interactions',
        'https://www.platform.aldra.no',
      ],
      token_endpoint_auth_method: 'none',
      isDevelopment: false,
      isFirstParty: true,
    },
  ] satisfies Configuration['clients'];
