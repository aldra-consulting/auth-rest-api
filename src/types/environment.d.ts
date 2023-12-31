declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV?: 'development' | 'production';
    HOST?: string;
    PORT?: string;
    ISSUER?: string;
    REALM?: string;
    AWS_REGION?: string;
    AWS_COGNITO_USER_POOL_ID?: string;
    AWS_COGNITO_USER_POOL_CLIENT_ID?: string;
    OIDC_PROVIDER_DB_TABLE?: string;
    COOKIE_DOMAIN_NAME?: string;
    USE_DEV_INTERACTIONS?: string;
    AUTH_INTERACTIONS_URL?: string;
  }
}
