import {Type} from '@angular/core';

import {RestMiddleware} from './rest.interface';
import {ReportProgressMiddleware, ResponseTypeMiddleware, IgnoredInterceptorsMiddleware, ResponseTransformMiddleware, ProducesMiddleware, BodyParameterMiddleware, PathParameterMiddleware, QueryObjectParameterMiddleware, QueryParameterMiddleware, HeaderParameterMiddleware, HeadersMiddleware, CacheMiddleware, LoggerMiddleware, ProgressIndicatorGroupMiddleware} from './middlewares';

/**
 * Definition of basic default array of rest middlewares order
 */
export const BASIC_DEFAULT_REST_MIDDLEWARES_ORDER: Type<RestMiddleware>[] =
[
    BodyParameterMiddleware,
    PathParameterMiddleware,
    QueryObjectParameterMiddleware,
    QueryParameterMiddleware,
    HeadersMiddleware,
    HeaderParameterMiddleware,
    ProducesMiddleware,
    LoggerMiddleware,
    IgnoredInterceptorsMiddleware,
    ProgressIndicatorGroupMiddleware,
    ResponseTransformMiddleware,
    ResponseTypeMiddleware,
    CacheMiddleware,
    ReportProgressMiddleware
];

/**
 * Definition of basic defaut array of rest middlewares used for each rest method
 */
export const BASIC_DEFAULT_REST_METHOD_MIDDLEWARES: Type<RestMiddleware>[] =
[
    LoggerMiddleware,
    ResponseTypeMiddleware,
    ReportProgressMiddleware
];