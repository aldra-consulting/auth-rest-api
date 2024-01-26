import { type EnvironmentVariables } from '@project/types';

export default () =>
  ({
    development: [
      'http://localhost:8002',
      'http://localhost:8003',
      'http://localhost:8004',
      'http://0.0.0.0:8002',
      'http://0.0.0.0:8003',
      'http://0.0.0.0:8004',
    ],
    production: [
      'https://www.aldra.no',
      'https://www.id.aldra.no',
      'https://www.platform.aldra.no',
    ],
  }) satisfies Record<EnvironmentVariables['NODE_ENV'], string[]>;
