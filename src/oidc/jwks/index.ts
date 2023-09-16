import { type Configuration } from 'oidc-provider';

import { getJwks } from '@project/utils/crypto';

export default async () => getJwks() satisfies Promise<Configuration['jwks']>;
