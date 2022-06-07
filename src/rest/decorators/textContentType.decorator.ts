import {extend} from '@jscrpt/common';

import type {RESTClient} from '../common';
import {RestHttpHeaders, RestMethodMiddlewares} from '../rest.interface';
import {HeadersMiddleware} from '../middlewares';

/**
 * Add custom header Content-Type "text/plain" to headers array
 */
export function TextContentType()
{
    return function<TDecorated>(_target: RESTClient, _propertyKey: string, descriptor: RestHttpHeaders &
                                                                                       RestMethodMiddlewares |
                                                                                       TDecorated): TypedPropertyDescriptor<any>
    {
        const descr = descriptor as RestHttpHeaders & RestMethodMiddlewares;

        descr.headers = extend(descr.headers ?? {}, {'content-type': 'text/plain'});
        descr.middlewareTypes?.push(HeadersMiddleware);

        return descr;
    };
}
