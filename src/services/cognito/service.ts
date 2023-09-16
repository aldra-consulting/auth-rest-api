import CognitoIdentityServiceProvider from 'aws-sdk/clients/cognitoidentityserviceprovider';
import { decodeJwt } from 'jose';

import { type AwsRegion } from '@project/enums';
import logger, { serviceTags } from '@project/utils/logging';

import { type CognitoUser, type SignInResponse } from './types';

const tags = [...serviceTags, 'cognito'];

export default class CognitoService {
  #client: CognitoIdentityServiceProvider;

  #userPoolId: string;

  #clientId: string;

  constructor(
    region: AwsRegion,
    userPoolId: string,
    clientId: string,
    client?: CognitoIdentityServiceProvider
  ) {
    this.#client = client ?? new CognitoIdentityServiceProvider({ region });
    this.#userPoolId = userPoolId;
    this.#clientId = clientId;
  }

  findUserByUsername = async (
    username: string,
    type?: 'email'
  ): Promise<Partial<CognitoUser> | null> => {
    try {
      const { Users: [user] = [] } = await this.#client
        .listUsers({
          UserPoolId: this.#userPoolId,
          Filter: `${type ?? 'username'} = '${username}'`,
          Limit: 1,
        })
        .promise();

      if (user) {
        logger.info(`User found for username: ${username}`, {
          tags: [...tags, 'success'],
        });

        return this.toUser(user);
      }

      logger.warn(`User not found for username: ${username}`, {
        tags: [...tags, 'warning'],
      });

      return null;
    } catch (error) {
      throw this.#handleError(error);
    }
  };

  signIn = async (
    username: string,
    password: string
  ): Promise<SignInResponse> => {
    try {
      const { AuthenticationResult } = await this.#client
        .adminInitiateAuth({
          AuthFlow: 'ADMIN_NO_SRP_AUTH',
          UserPoolId: this.#userPoolId,
          ClientId: this.#clientId,
          AuthParameters: {
            USERNAME: username,
            PASSWORD: password,
          },
        })
        .promise();

      if (AuthenticationResult?.IdToken) {
        const { sub, email_verified: emailVerified = false } = decodeJwt(
          AuthenticationResult.IdToken
        );

        logger.info(`User with ID: ${sub} successfully authenticated`, {
          tags: [...tags, 'success'],
        });

        return { sub, emailVerified: Boolean(emailVerified) };
      }
      throw new Error('Failed to authenticate user');
    } catch (error) {
      throw this.#handleError(error);
    }
  };

  sendConfirmationCode = async (username: string): Promise<void> => {
    try {
      await this.#client
        .resendConfirmationCode({
          ClientId: this.#clientId,
          Username: username,
          UserContextData: {
            EncodedData: '',
          },
        })
        .promise();

      logger.info('Successfully sent confirmation code to user', {
        tags: [...tags, 'success'],
      });
    } catch (error) {
      logger.info('Failed to send confirmation code to user', {
        tags: [...tags, 'error'],
      });

      throw this.#handleError(error);
    }
  };

  verifyUser = async (username: string, code: string): Promise<void> => {
    try {
      await this.#client
        .confirmSignUp({
          ClientId: this.#clientId,
          Username: username,
          ConfirmationCode: code,
          UserContextData: {
            EncodedData: '',
          },
        })
        .promise();

      logger.info('Successfully confirmed user registration', {
        tags: [...tags, 'success'],
      });
    } catch (error) {
      logger.info('Failed to confirm user registration', {
        tags: [...tags, 'error'],
      });

      throw this.#handleError(error);
    }
  };

  private toUser(
    user: CognitoIdentityServiceProvider.UserType
  ): Partial<CognitoUser> {
    const {
      Attributes: userAttributes = [],
      Enabled: enabled,
      UserCreateDate: createdAt,
      UserLastModifiedDate: lastModifiedAt,
      Username: username,
      UserStatus: status,
    } = user;

    const attributes = this.#unmarshallUserAttributes(userAttributes);

    return { username, attributes, createdAt, lastModifiedAt, status, enabled };
  }

  #unmarshallUserAttributes = (
    attributes: CognitoIdentityServiceProvider.AttributeListType
  ): Record<string, string> =>
    attributes.reduce(
      (previous, { Name: name, Value: value }) => ({
        ...previous,
        [name.startsWith('custom') ? name.replace('custom:', '') : name]: value,
      }),
      {}
    );

  #handleError = <T>(error: T): T => {
    if (error instanceof Error) {
      logger.error(error.message, {
        tags: [...tags, 'error'],
        error,
      });
    }

    return error;
  };
}
