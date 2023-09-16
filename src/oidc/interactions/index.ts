import { type Configuration } from 'oidc-provider';

import env from '@project/env';

import policy from '../policy';

const { AUTH_INTERACTIONS_URL: host, USE_DEV_INTERACTIONS } = env;

export default () =>
  ({
    policy: policy(),
    url: (_, { uid }) => {
      if (USE_DEV_INTERACTIONS) {
        return `/interaction/${uid}`;
      }

      return `${host}/sign-in?id=${uid}`;
    },
  }) satisfies Configuration['interactions'];
