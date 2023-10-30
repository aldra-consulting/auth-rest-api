import type * as Koa from 'koa';

declare module 'http' {
  interface State {
    cspNonce: string;
  }
  interface IncomingMessage {
    state: State;
  }
}

declare module 'koa' {
  interface DefaultState extends Koa.DefaultContextExtends {
    cspNonce: string;
  }
}
