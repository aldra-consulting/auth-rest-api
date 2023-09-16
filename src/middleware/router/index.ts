import Router from '@koa/router';

import env from '@project/env';
import { cognito } from '@project/services';
import { type Primitive } from '@project/types';
import logger, { routeTags } from '@project/utils/logging';

import body from '../body';

import type Provider from 'oidc-provider';

const { AUTH_INTERACTIONS_URL: host, USE_DEV_INTERACTIONS } = env;

const interactionRouteTags = [...routeTags, 'interaction'];

export default (provider: Provider) => {
  const router = new Router();

  router.get('/favicon.ico', (ctx) => {
    ctx.respond = false;
  });

  router.post('/interaction/:uid', body, async (ctx, next) => {
    const {
      prompt: { name: promptName },
    } = await provider.interactionDetails(ctx.req, ctx.res);

    logger.info('Submitting interaction', {
      tags: [...interactionRouteTags, 'submit'],
      prompt: promptName,
    });

    switch (promptName) {
      case 'login': {
        try {
          const { login: identifier, password } = ctx.request.body as Record<
            string,
            Primitive
          >;

          const { sub: accountId, emailVerified } = USE_DEV_INTERACTIONS
            ? { sub: identifier, emailVerified: true }
            : await cognito.signIn(String(identifier), String(password));

          if (accountId) {
            return provider.interactionFinished(
              ctx.req,
              ctx.res,
              {
                login: { accountId: String(accountId) },
                email_verification: {
                  verified: emailVerified,
                },
              },
              { mergeWithLastSubmission: false }
            );
          }
        } catch (error) {
          logger.error('Error submitting interaction', {
            tags: [...interactionRouteTags, 'submit', 'error'],
            prompt: promptName,
            error,
          });
        }

        return ctx.redirect(`${host}/error`);
      }
      default: {
        return next();
      }
    }
  });

  return router;
};
