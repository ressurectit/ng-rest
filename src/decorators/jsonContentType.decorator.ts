import {extend} from '@jscrpt/common/extend';

import {HeadersMiddleware} from '../middlewares';
import type {RESTClientBase} from '../misc/classes/restClientBase';
import {RestHttpHeaders, RestMethodMiddlewares} from '../interfaces';

/**
 * Add custom header Content-Type "application/json" to headers array
 */
export function JsonContentType()
{
    return function<TDecorated>(_target: RESTClientBase, _propertyKey: string, descriptor: RestHttpHeaders &
                                                                                           RestMethodMiddlewares |
                                                                                           TDecorated): TDecorated
    {
        const descr = descriptor as RestHttpHeaders & RestMethodMiddlewares;

        descr.headers = extend(descr.headers ?? {}, {'content-type': 'application/json'});
        descr.middlewareTypes.push(HeadersMiddleware);

        return descr as TDecorated;
    };
}
