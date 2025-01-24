import {StringDictionary} from '@jscrpt/common';
import {extend} from '@jscrpt/common/extend';

import {HeadersMiddleware} from '../middlewares';
import type {RESTClientBase} from '../misc/classes/restClientBase';
import {RestHttpHeaders, RestMethodMiddlewares} from '../interfaces';

/**
 * Set custom headers for a REST method
 * @param headersDef - custom headers in a key-value pair
 */
export function Headers(headersDef: StringDictionary)
{
    return function<TDecorated>(_target: RESTClientBase, _propertyKey: string, descriptor: RestHttpHeaders &
                                                                                           RestMethodMiddlewares |
                                                                                           TDecorated): TDecorated
    {
        const descr = descriptor as RestHttpHeaders & RestMethodMiddlewares;

        descr.headers = extend(descr.headers ?? {}, headersDef);
        descr.middlewareTypes.push(HeadersMiddleware);

        return descr as TDecorated;
    };
}