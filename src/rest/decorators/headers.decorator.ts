import {extend, StringDictionary} from '@jscrpt/common';

import {RESTClient} from '../common';
import {RestHttpHeaders, RestMethodMiddlewares} from '../rest.interface';
import {HeadersMiddleware} from '../middlewares';

/**
 * Set custom headers for a REST method
 * @param headersDef - custom headers in a key-value pair
 */
export function Headers(headersDef: StringDictionary)
{
    return function<TDecorated>(_target: RESTClient, _propertyKey: string, descriptor: RestHttpHeaders &
                                                                                       RestMethodMiddlewares |
                                                                                       TDecorated): TypedPropertyDescriptor<any>
    {
        const descr = descriptor as RestHttpHeaders & RestMethodMiddlewares;

        descr.headers = extend(descr.headers ?? {}, headersDef);
        descr.middlewareTypes?.push(HeadersMiddleware);

        return descr;
    };
}