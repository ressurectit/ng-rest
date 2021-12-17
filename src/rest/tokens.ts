import {InjectionToken, Type} from '@angular/core';

import {RestDateApi, RestMiddleware} from './rest.interface';
import {BASIC_DEFAULT_REST_MIDDLEWARES_ORDER, BASIC_DEFAULT_REST_METHOD_MIDDLEWARES} from './defaults';

/**
 * Injection token used for injecting array of rest middleware types that defines order of rest middlewares
 */
export const REST_MIDDLEWARES_ORDER: InjectionToken<Type<RestMiddleware>[]> = new InjectionToken<Type<RestMiddleware>[]>('REST_MIDDLEWARES_ORDER', {providedIn: 'root', factory: () => BASIC_DEFAULT_REST_MIDDLEWARES_ORDER});

/**
 * Injection token used for injecting array of rest middleware types that are default for each rest method
 */
export const REST_METHOD_MIDDLEWARES: InjectionToken<Type<RestMiddleware>[]> = new InjectionToken<Type<RestMiddleware>[]>('REST_METHOD_MIDDLEWARES', {providedIn: 'root', factory: () => BASIC_DEFAULT_REST_METHOD_MIDDLEWARES});

/**
 * Injection token used for injecting RestDateApi implementation
 */
export const REST_DATE_API: InjectionToken<RestDateApi> = new InjectionToken<RestDateApi>('REST_DATE_API');