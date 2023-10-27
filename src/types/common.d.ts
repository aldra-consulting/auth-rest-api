import { type AwsRegion } from './enums';

export type Primitive =
  | string
  | number
  | bigint
  | boolean
  | null
  | symbol
  | undefined;

export type Hashable = NonNullable<Primitive>;

export type Nullable<T = never> = T | null | undefined;

export interface EnvironmentVariables {
  NODE_ENV: 'development' | 'production';
  HOST: string;
  PORT: number;
  ISSUER: string;
  REALM: string;
  AWS_REGION: AwsRegion;
  AWS_COGNITO_USER_POOL_ID: string;
  AWS_COGNITO_USER_POOL_CLIENT_ID: string;
  AWS_SECRET_ARN_OIDC_COOKIE_KEYS: string;
  AWS_SECRET_ARN_OIDC_JWKS: string;
  OIDC_PROVIDER_DB_TABLE: string;
  COOKIE_DOMAIN_NAME: string;
  USE_DEV_INTERACTIONS: boolean;
  AUTH_INTERACTIONS_URL: string;
}
