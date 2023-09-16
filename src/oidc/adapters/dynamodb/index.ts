import { Marshaller } from '@aws/dynamodb-auto-marshaller';
import { DynamoDB } from 'aws-sdk';

import env from '@project/env';
import { isProductionEnvironment, isString } from '@project/utils/common';

const { AWS_REGION: region, OIDC_PROVIDER_DB_TABLE: TableName } = env;

export default class DynamoDBAdapter {
  #name: string;

  #client: DynamoDB;

  #marshaller: Marshaller;

  constructor(name: string, client?: DynamoDB, marshaller?: Marshaller) {
    this.#name = name;
    this.#client =
      client ??
      new DynamoDB({
        region,
        sslEnabled: isProductionEnvironment(),
        convertResponseTypes: false,
        paramValidation: false,
      });
    this.#marshaller = marshaller ?? new Marshaller({ unwrapNumbers: true });
  }

  upsert = async (
    id: string,
    payload: Record<string, string>,
    expiresIn: number
  ): Promise<void> => {
    const key = this.#key(id);

    if (this.#name === 'Session' && 'uid' in payload) {
      await this.#set(
        this.sessionUidKeyFor(payload.uid),
        { payload: id },
        expiresIn
      );
    }

    const { grantId, userCode } = payload;

    if (grantId) {
      const grantKey = this.#grantKeyFor(grantId);
      const grant = (await this.#get<string>(grantKey))?.payload;

      await this.#set(
        grantKey,
        {
          payload:
            grant && Array.isArray(grant) ? [...grant.slice(-10), key] : [key],
        },
        expiresIn
      );
    }

    if (userCode) {
      await this.#set(
        this.#userCodeKeyFor(userCode),
        { payload: id },
        expiresIn
      );
    }

    await this.#set(key, payload, expiresIn);
  };

  find = async (id: string): Promise<Record<string, unknown> | undefined> =>
    this.#get(this.#key(id));

  findByUserCode = async (
    userCode: string
  ): Promise<Record<string, unknown> | undefined> => {
    const id = (await this.#get<string>(this.#userCodeKeyFor(userCode)))
      ?.payload;

    return id ? this.find(id) : undefined;
  };

  findByUid = async (
    uid: string
  ): Promise<Record<string, unknown> | undefined> => {
    const id = (await this.#get<string>(this.sessionUidKeyFor(uid)))?.payload;

    return id ? this.find(id) : undefined;
  };

  consume = async (id: string): Promise<void> => {
    const marshalledId = this.#marshaller.marshallValue(this.#key(id));
    const marshalledConsumedAt = this.#marshaller.marshallValue(
      Math.floor(Date.now() / 1000)
    );

    if (marshalledId && marshalledConsumedAt) {
      await this.#client
        .updateItem({
          TableName,
          Key: { id: marshalledId },
          UpdateExpression: 'set consumedAt = :consumedAt',
          ExpressionAttributeValues: { ':consumedAt': marshalledConsumedAt },
        })
        .promise();
    }
  };

  public async destroy(id: string): Promise<void> {
    await this.#remove(this.#key(id));
  }

  public async revokeByGrantId(grantId: string): Promise<void> {
    const grantKey = this.#grantKeyFor(grantId);
    const grant = (await this.#get(grantKey))?.payload;

    if (grant && Array.isArray(grant) && grant.every(isString)) {
      grant.forEach((token) => {
        this.#remove(token).catch(() => {});
      });

      this.#remove(grantKey).catch(() => {});
    }
  }

  #get = async <Payload, T extends object = { payload: Payload }>(
    key: string
  ): Promise<T | undefined> => {
    const marshalledKey = this.#marshaller.marshallValue(key);

    if (marshalledKey) {
      const { Item: item } = await this.#client
        .getItem({
          TableName,
          Key: {
            id: marshalledKey,
          },
        })
        .promise();

      if (item) {
        return this.#marshaller.unmarshallItem(item) as T;
      }
    }

    return undefined;
  };

  #set = async <T>(key: string, value: T, ttl?: number): Promise<void> => {
    await this.#client
      .putItem({
        TableName,
        Item: this.#marshaller.marshallItem({
          id: key,
          ...value,
          expiresAt: ttl ? Math.floor(Date.now() / 1000) + ttl : undefined,
        }),
      })
      .promise();
  };

  #remove = async (key: string): Promise<void> => {
    const marshalledKey = this.#marshaller.marshallValue(key);

    if (marshalledKey) {
      await this.#client
        .deleteItem({
          TableName,
          Key: {
            id: marshalledKey,
          },
        })
        .promise();
    }
  };

  #key = (id: string): string => `${this.#name}:${id}`;

  #grantKeyFor = (id: string): string => `grant:${id}`;

  sessionUidKeyFor = (id: string): string => `sessionUid:${id}`;

  #userCodeKeyFor = (userCode: string): string => `userCode:${userCode}`;
}
