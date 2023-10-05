import { randomBytes } from 'crypto';

import { generateKeyPair, exportJWK } from 'jose';
import { type JWKS } from 'oidc-provider';

import env from '@project/env';
import { secretsManager } from '@project/services';
import {
  isDefined,
  isDevelopmentEnvironment,
  isString,
} from '@project/utils/common';

const { AWS_SECRET_ARN_OIDC_COOKIE_KEYS, AWS_SECRET_ARN_OIDC_JWKS } = env;

async function generateRuntimeJWKS(): Promise<JWKS> {
  const { privateKey } = await generateKeyPair('RS512');

  return { keys: [await exportJWK(privateKey)] };
}

function assertJWKS(value: unknown): asserts value is JWKS {
  if (!(typeof value === 'object' && isDefined(value) && 'keys' in value)) {
    throw new Error('Provided value does not conform to the JWKS interface');
  }
}

async function generateRuntimeCookieKeys(): Promise<string[]> {
  return new Promise((resolve) => {
    randomBytes(48, (_, buffer) => resolve([buffer.toString('hex')]));
  });
}

function assertCookieKeys(value: unknown): asserts value is string[] {
  if (!(Array.isArray(value) && value.every(isString))) {
    throw new Error('Provided value does not conform to the JWKS interface');
  }
}

export async function getCookieKeys(): Promise<string[]> {
  if (isDevelopmentEnvironment()) {
    return generateRuntimeCookieKeys();
  }

  const value = JSON.parse(
    await secretsManager.getSecret(AWS_SECRET_ARN_OIDC_COOKIE_KEYS)
  ) as unknown;

  assertCookieKeys(value);

  return value;
}

export async function getJwks(): Promise<JWKS> {
  if (isDevelopmentEnvironment()) {
    return generateRuntimeJWKS();
  }

  const value = JSON.parse(
    await secretsManager.getSecret(AWS_SECRET_ARN_OIDC_JWKS)
  ) as unknown;

  assertJWKS(value);

  return value;
}
