import { type Configuration } from 'oidc-provider';

export default () =>
  ({
    authorization: '/auth',
    end_session: '/logout',
    introspection: '/token/introspect',
    jwks: '/jwks',
    registration: '/reg',
    revocation: '/token/revoke',
    token: '/token',
    userinfo: '/userinfo',
  }) satisfies Configuration['routes'];
