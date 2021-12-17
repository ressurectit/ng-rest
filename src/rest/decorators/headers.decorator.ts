import {extend} from '@jscrpt/common';

import {RESTClient} from '../common';
import {RestHttpHeaders, RestMethodMiddlewares} from '../rest.interface';
import {HeadersMiddleware} from '../middlewares';

/**
 * Set custom headers for a REST method
 * @param headersDef - custom headers in a key-value pair
 */
export function Headers(headersDef: {[key: string]: string})
{
    return function(_target: RESTClient, _propertyKey: string, descriptor: RestHttpHeaders &
                                                                           RestMethodMiddlewares)
    {
        descriptor.headers = extend(descriptor.headers ?? {}, headersDef);
        descriptor.middlewareTypes.push(HeadersMiddleware);

        return descriptor;
    };
}