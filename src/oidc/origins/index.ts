import { type EnvironmentVariables } from '@project/types';

export default () =>
  ({
    development: [
      'http://localhost:8002',
      'http://localhost:8003',
      'http://0.0.0.0:8002',
      'http://0.0.0.0:8003',
    ],
    production: ['https://aldra.no', 'https://id.aldra.no'],
  }) satisfies Record<EnvironmentVariables['NODE_ENV'], string[]>;
