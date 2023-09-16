import { interactionPolicy } from 'oidc-provider';

const { base } = interactionPolicy;

const policy = base();

policy.remove('consent');

export default () => policy;
