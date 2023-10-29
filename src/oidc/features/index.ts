import { type Configuration } from 'oidc-provider';

import env from '@project/env';

const { USE_DEV_INTERACTIONS, AUTH_INTERACTIONS_URL } = env;

export default () =>
  ({
    introspection: { enabled: true },
    revocation: { enabled: true },
    devInteractions: { enabled: !!USE_DEV_INTERACTIONS },
    rpInitiatedLogout: {
      enabled: true,
      logoutSource(ctx, form) {
        ctx.set('Content-Security-Policy', "script-src 'self' 'unsafe-inline'");

        ctx.body = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              html {
                height: 100%;
                background: #2d3741;
              }
            </style>
          </head>
          <body>
            ${form}
            <input type="hidden" name="logout" value="yes" form="op.logoutForm" />
            <script>
              document.forms['op.logoutForm'].submit()
            </script>
          </body>
        </html>`;
      },
      postLogoutSuccessSource(ctx) {
        ctx.redirect(AUTH_INTERACTIONS_URL);
      },
    },
  }) satisfies Configuration['features'];
