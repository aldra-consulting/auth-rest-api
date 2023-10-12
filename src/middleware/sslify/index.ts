import sslify, { forwardedResolver } from 'koa-sslify';

export default (sslify as unknown as { default: typeof sslify }).default({
  resolver: forwardedResolver,
});
