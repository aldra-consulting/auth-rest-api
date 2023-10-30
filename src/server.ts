import Provider from 'oidc-provider';

import { ApplicationPhase } from '@project/enums';
import env from '@project/env';

import {
  compression,
  cors,
  crossdomain,
  csp,
  helmet,
  referrer,
  router,
  state,
} from './middleware';
import configuration from './oidc';
import { serverConfiguration, queueListener } from './plugins';

const { ISSUER: issuer } = env;

export default async () =>
  (async () => {
    const provider = new Provider(issuer, await configuration());

    provider.proxy = env.NODE_ENV === 'production';

    provider.use(state);
    provider.use(compression);
    provider.use(cors);
    provider.use(helmet);
    provider.use(crossdomain);
    provider.use(csp);
    provider.use(referrer);
    provider.use(router(provider).routes());

    provider.on(ApplicationPhase.SERVER_START, serverConfiguration);
    provider.on(ApplicationPhase.SERVER_START, queueListener);

    return provider;
  })().then((provider) => {
    provider.emit(ApplicationPhase.SERVER_START);

    return provider;
  });
