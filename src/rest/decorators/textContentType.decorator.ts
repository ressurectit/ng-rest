import {extend} from '@jscrpt/common';

import {RESTClient} from '../common';
import {RestHttpHeaders, RestMethodMiddlewares} from '../rest.interface';
import {HeadersMiddleware} from '../middlewares';

/**
 * Add custom header Content-Type "text/plain" to headers array
 */
export function TextContentType()
{
    return function(_target: RESTClient, _propertyKey: string, descriptor: RestHttpHeaders &
                                                                           RestMethodMiddlewares)
    {
        descriptor.headers = extend(descriptor.headers ?? {}, {'content-type': 'text/plain'});
        descriptor.middlewareTypes.push(HeadersMiddleware);

        return descriptor;
    };
}
