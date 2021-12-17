import {extend} from '@jscrpt/common';

import {RESTClient} from '../common';
import {RestHttpHeaders, RestMethodMiddlewares} from '../rest.interface';
import {HeadersMiddleware} from '../middlewares';

/**
 * Add custom header Accept that sets accepted type to any
 */
export function AcceptAny()
{
    return function(_target: RESTClient, _propertyKey: string, descriptor: RestHttpHeaders &
                                                                           RestMethodMiddlewares)
    {
        descriptor.headers = extend(descriptor.headers ?? {}, {'accept': '*/*'});
        descriptor.middlewareTypes.push(HeadersMiddleware);

        return descriptor;
    };
}
