import env from '@project/env';
import logger, { serverConfigTags } from '@project/utils/logging';

const { ISSUER: issuer, NODE_ENV: environment } = env;

export default () => {
  logger.info(`Issuer is set to ${issuer} in ${environment} mode`, {
    tags: [...serverConfigTags, 'issuer'],
  });
};
