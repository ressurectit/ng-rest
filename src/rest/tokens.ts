import {InjectionToken} from '@angular/core';

import {RestMiddlewareOrderType, RestDateApi, RestMiddleware, RestMiddlewareType} from './rest.interface';
import {BASIC_DEFAULT_REST_MIDDLEWARES_ORDER, BASIC_DEFAULT_REST_METHOD_MIDDLEWARES} from './defaults';
import {MockLogger} from './services/mockLogger/mockLogger.interface';

/**
 * Injection token used for injecting array of rest middleware types that defines order of rest middlewares
 */
export const REST_MIDDLEWARES_ORDER: InjectionToken<RestMiddlewareOrderType<string>[]> = new InjectionToken<RestMiddlewareOrderType<string>[]>('REST_MIDDLEWARES_ORDER', {providedIn: 'root', factory: () => BASIC_DEFAULT_REST_MIDDLEWARES_ORDER});

/**
 * Injection token used for injecting array of rest middleware types that are default for each rest method
 */
export const REST_METHOD_MIDDLEWARES: InjectionToken<RestMiddlewareType<RestMiddleware>[]> = new InjectionToken<RestMiddlewareType<RestMiddleware>[]>('REST_METHOD_MIDDLEWARES', {providedIn: 'root', factory: () => BASIC_DEFAULT_REST_METHOD_MIDDLEWARES});

/**
 * Injection token used for injecting RestDateApi implementation
 */
export const REST_DATE_API: InjectionToken<RestDateApi> = new InjectionToken<RestDateApi>('REST_DATE_API');

/**
 * Injection token used for injecting MockLogger used for logging responses for mocks
 */
export const REST_MOCK_LOGGER: InjectionToken<MockLogger> = new InjectionToken<MockLogger>('REST_MOCK_LOGGER');
