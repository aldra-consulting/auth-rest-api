import { env } from 'process';

import { type Hashable } from '@project/types';

export function isDefined<T>(value: T): value is NonNullable<T> {
  return value !== undefined && value !== null;
}

function assertDefined<T extends Hashable>(
  key: string,
  value: T
): asserts value is NonNullable<T> {
  if (!isDefined(value)) {
    throw new Error(
      `Expected ${key} to be defined, but received ${String(value)}`
    );
  }
}

export const checkEnvironmentVariables = <T extends object>(envObj: T): T => {
  Object.entries(envObj).forEach(([key, value]) => assertDefined(key, value));

  return envObj;
};

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export const isDevelopmentEnvironment = (): boolean =>
  env.NODE_ENV === 'development';

export const isProductionEnvironment = (): boolean =>
  env.NODE_ENV === 'production';
