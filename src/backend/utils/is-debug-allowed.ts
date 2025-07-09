import { isProduction } from './is-production';

export const isDebugAllowed = () => !isProduction();
