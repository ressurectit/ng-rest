import type * as middlewares from './middlewares';

/**
 * Array of middleware names that are built-in
 */
export type middlewareTypes = keyof typeof middlewares;
