import { AwsRegion } from '@project/enums';
import { checkEnvironmentVariables } from '@project/utils/common';

import { type EnvironmentVariables } from './types';

const {
  NODE_ENV = 'development',
  HOST = '0.0.0.0',
  PORT = 8001,
  ISSUER = `http://${HOST}:${PORT}`,
  REALM = 'aldra',
  AWS_REGION = AwsRegion.EU_WEST_1,
  AWS_COGNITO_USER_POOL_ID = '',
  AWS_COGNITO_USER_POOL_CLIENT_ID = '',
  AWS_SECRET_ARN_OIDC_COOKIE_KEYS = '',
  AWS_SECRET_ARN_OIDC_JWKS = '',
  OIDC_PROVIDER_DB_TABLE = `${REALM}-consulting-${AWS_REGION}-${NODE_ENV}-oidc-provider`,
  USE_DEV_INTERACTIONS = false,
  AUTH_INTERACTIONS_URL = 'http://localhost:8002/interactions',
} = process.env;

export default checkEnvironmentVariables<EnvironmentVariables>({
  NODE_ENV: NODE_ENV === 'development' ? 'development' : 'production',
  HOST,
  PORT: Number(PORT),
  ISSUER,
  REALM,
  AWS_REGION: AWS_REGION as AwsRegion,
  AWS_COGNITO_USER_POOL_ID,
  AWS_COGNITO_USER_POOL_CLIENT_ID,
  AWS_SECRET_ARN_OIDC_COOKIE_KEYS,
  AWS_SECRET_ARN_OIDC_JWKS,
  OIDC_PROVIDER_DB_TABLE,
  USE_DEV_INTERACTIONS: ['true', true].includes(USE_DEV_INTERACTIONS),
  AUTH_INTERACTIONS_URL,
});
