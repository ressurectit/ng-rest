import {extend} from '@jscrpt/common';

import {HeadersMiddleware} from '../middlewares';
import type {RESTClientBase} from '../misc/classes/restClientBase';
import {RestHttpHeaders, RestMethodMiddlewares} from '../interfaces';

/**
 * Add custom header Content-Type "text/plain" to headers array
 */
export function TextContentType()
{
    return function<TDecorated>(_target: RESTClientBase, _propertyKey: string, descriptor: RestHttpHeaders &
                                                                                           RestMethodMiddlewares |
                                                                                           TDecorated): TDecorated
    {
        const descr = descriptor as RestHttpHeaders & RestMethodMiddlewares;

        descr.headers = extend(descr.headers ?? {}, {'content-type': 'text/plain'});
        descr.middlewareTypes.push(HeadersMiddleware);

        return descr as TDecorated;
    };
}
