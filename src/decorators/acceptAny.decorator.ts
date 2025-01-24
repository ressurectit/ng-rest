import {extend} from '@jscrpt/common/extend';

import {HeadersMiddleware} from '../middlewares';
import type {RESTClientBase} from '../misc/classes/restClientBase';
import {RestHttpHeaders, RestMethodMiddlewares} from '../interfaces';

/**
 * Add custom header Accept that sets accepted type to any
 */
export function AcceptAny()
{
    return function<TDecorated>(_target: RESTClientBase, _propertyKey: string, descriptor: RestHttpHeaders &
                                                                                           RestMethodMiddlewares |
                                                                                           TDecorated): TDecorated
    {
        const descr = descriptor as RestHttpHeaders & RestMethodMiddlewares;

        descr.headers = extend(descr.headers ?? {}, {accept: '*/*'});
        descr.middlewareTypes.push(HeadersMiddleware);

        return descr as TDecorated;
    };
}
