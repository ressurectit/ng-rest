import {RestMiddleware} from '../interfaces';
import {LoggerMiddleware} from '../middlewares/logger.middleware';
import {ReportProgressMiddleware} from '../middlewares/reportProgress.middleware';
import {ResponseTypeMiddleware} from '../middlewares/responseType.middleware';
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const BASIC_DEFAULT_REST_METHOD_MIDDLEWARES: RestMiddlewareType<RestMiddleware<any, any, any, any, any>>[] =
[
    LoggerMiddleware,
    ResponseTypeMiddleware,
    ReportProgressMiddleware,
];