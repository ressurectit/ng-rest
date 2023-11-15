import {RestMiddleware} from '../interfaces';
import {ReportProgressMiddleware, ResponseTypeMiddleware, LoggerMiddleware} from '../middlewares';
import {RestMiddlewareOrderType, RestMiddlewareType, middlewareTypes} from './types';

/**
 * Definition of basic default array of rest middlewares order
 */
export const BASIC_DEFAULT_REST_MIDDLEWARES_ORDER: RestMiddlewareOrderType<middlewareTypes>[] =
[
    'BodyParameterMiddleware',
    'PathParameterMiddleware',
    'QueryObjectParameterMiddleware',
    'QueryParameterMiddleware',
    'HeadersMiddleware',
    'HeaderParameterMiddleware',
    'ProducesMiddleware',
    'LoggerMiddleware',
    'IgnoredInterceptorsMiddleware',
    'ProgressIndicatorGroupMiddleware',
    'ResponseTransformMiddleware',
    'ResponseTypeMiddleware',
    'CacheMiddleware',
    'ClearAdvancedCacheMiddleware',
    'AdvancedCacheMiddleware',
    'MockLoggerMiddleware',
    'ReportProgressMiddleware',
];

/**
 * Definition of basic defaut array of rest middlewares used for each rest method
 */
export const BASIC_DEFAULT_REST_METHOD_MIDDLEWARES: RestMiddlewareType<RestMiddleware>[] =
[
    LoggerMiddleware,
    ResponseTypeMiddleware,
    ReportProgressMiddleware,
];