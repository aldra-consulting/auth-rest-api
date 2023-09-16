import SecretsManager from 'aws-sdk/clients/secretsmanager';

import { type AwsRegion } from '@project/enums';
import logger, { serviceTags } from '@project/utils/logging';

const tags = [...serviceTags, 'secrets-manager'];

export default class SecretsManagerService {
  #client: SecretsManager;

  constructor(region: AwsRegion, client?: SecretsManager) {
    this.#client = client ?? new SecretsManager({ region });
  }

  getSecret = async (id: string): Promise<string> => {
    try {
      const { SecretString, SecretBinary } = await this.#client
        .getSecretValue({ SecretId: id })
        .promise();

      if (SecretString) {
        return SecretString;
      }

      if (SecretBinary) {
        return Buffer.from(SecretBinary as string, 'base64').toString('ascii');
      }
    } catch (error) {
      throw this.#handleError(error);
    }

    return '';
  };

  #handleError = <T>(error: T): T => {
    let message = 'An error occurred';

    if (error instanceof Error && 'code' in error) {
      if (error.code === 'DecryptionFailureException') {
        message = `Secrets Manager can't decrypt the protected secret text using the provided KMS key`;
      } else if (error.code === 'InternalServiceErrorException') {
        message = 'An error occurred on the server side';
      } else if (error.code === 'InvalidParameterException') {
        message = 'An invalid value provided for a parameter';
      } else if (error.code === 'InvalidRequestException') {
        message =
          'Provided parameter value is not valid for the current state of the resource';
      } else if (error.code === 'ResourceNotFoundException') {
        message = `Resource not found`;
      }
    }

    logger.error(message, {
      tags: [...tags, 'error'],
      error,
    });

    return error;
  };
}
