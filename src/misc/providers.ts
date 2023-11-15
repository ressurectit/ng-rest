import {ClassProvider, EnvironmentProviders, Provider, Type, ValueProvider, makeEnvironmentProviders} from '@angular/core';

import {RestMiddlewareOrderType, RestMiddlewareType} from './types';
import {REST_DATE_API, REST_METHOD_MIDDLEWARES, REST_MIDDLEWARES_ORDER, REST_MOCK_LOGGER} from './tokens';
import {MockLogger, RestDateApi} from '../interfaces';

/**
 * Provides rest middlewares execution order
 * @param order - Execution order of middlewares
 */
export function provideRestMiddlewaresOrder<TMiddlewareTypes extends string = string>(order: RestMiddlewareOrderType<TMiddlewareTypes>[]): Provider
{
    return <ValueProvider> {
        provide: REST_MIDDLEWARES_ORDER,
        useValue: order,
    };
}

/**
 * Provides middleware types for rest http method, executed each time
 * @param middlewares - Middleware types to be provided
 */
export function provideRestMethodMiddlewares(middlewares: RestMiddlewareType[]): Provider
{
     return <ValueProvider> {
        provide: REST_METHOD_MIDDLEWARES,
        useValue: middlewares,
    };
}

/**
 * Provides rest date api type
 * @param type - Type to be provided
 */
export function provideRestDateApi(type: Type<RestDateApi>): Provider
{
    return <ClassProvider> {
        provide: REST_DATE_API,
        useClass: type,
    };
}

/**
 * Provides mock logger
 * @param type - Type to be provided
 */
export function provideMockLogger(type: Type<MockLogger>): EnvironmentProviders
{
    return makeEnvironmentProviders(
    [
        <ClassProvider>
        {
            provide: REST_MOCK_LOGGER,
            useClass: type,
        }
    ]);
}
