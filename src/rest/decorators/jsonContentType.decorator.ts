import {extend} from '@jscrpt/common';

import {RESTClient} from '../common';
import {RestHttpHeaders, RestMethodMiddlewares} from '../rest.interface';
import {HeadersMiddleware} from '../middlewares';

/**
 * Add custom header Content-Type "application/json" to headers array
 */
export function JsonContentType()
{
    return function(_target: RESTClient, _propertyKey: string, descriptor: RestHttpHeaders &
                                                                           RestMethodMiddlewares)
    {
        descriptor.headers = extend(descriptor.headers ?? {}, {'content-type': 'application/json'});
        descriptor.middlewareTypes.push(HeadersMiddleware);

        return descriptor;
    };
}
