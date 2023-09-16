import env from '@project/env';

import SecretsManagerService from './service';

const { AWS_REGION: region } = env;

export default new SecretsManagerService(region);
