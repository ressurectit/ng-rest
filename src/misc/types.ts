import {Type} from '@angular/core';

import {AdvancedCacheItem, RestMiddleware} from '../interfaces';
import type * as middlewares from '../middlewares';

/**
 * Array of middleware names that are built-in
 */
export type middlewareTypes = keyof typeof middlewares;

/**
 * Definition of type that implements `RestMiddleware`
 */
export type RestMiddlewareType<TType extends RestMiddleware = RestMiddleware> = Type<TType>&{id: string};

/**
 * Definition of type that is used for definition of order of middlewares
 */
export type RestMiddlewareOrderType<TMiddlewareTypes extends string = string> = Type<RestMiddleware>|TMiddlewareTypes;

/**
 * Options for advanced cache item
 */
export type AdvancedCacheItemOptions<TDate = unknown> = Omit<AdvancedCacheItem<TDate>, 'response'>;