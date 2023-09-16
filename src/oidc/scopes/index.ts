import { type Configuration } from 'oidc-provider';

export default () =>
  Object.values({
    common: ['openid', 'email', 'profile', 'offline_access'],
  }).flat() satisfies Configuration['scopes'];
