import { SecretsManager } from '@aws-sdk/client-secrets-manager';

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
      const { SecretString } = await this.#client.getSecretValue({
        SecretId: id,
      });

      if (SecretString) {
        return SecretString;
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
