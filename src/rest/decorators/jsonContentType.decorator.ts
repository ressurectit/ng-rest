import {extend} from '@jscrpt/common';

import {RESTClient} from '../common';
import {RestHttpHeaders, RestMethodMiddlewares} from '../rest.interface';
import {HeadersMiddleware} from '../middlewares';

/**
 * Add custom header Content-Type "application/json" to headers array
 */
export function JsonContentType()
{
    return function<TDecorated>(_target: RESTClient, _propertyKey: string, descriptor: RestHttpHeaders &
                                                                                       RestMethodMiddlewares |
                                                                                       TDecorated): TypedPropertyDescriptor<any>
    {
        const descr = descriptor as RestHttpHeaders & RestMethodMiddlewares;

        descr.headers = extend(descr.headers ?? {}, {'content-type': 'application/json'});
        descr.middlewareTypes?.push(HeadersMiddleware);

        return descr;
    };
}
