import {extend} from '@jscrpt/common';

import {RESTClient} from '../common';
import {RestHttpHeaders} from '../rest.interface';

/**
 * Add custom header Content-Type "application/json" to headers array
 */
export function JsonContentType()
{
    return function(_target: RESTClient, _propertyKey: string, descriptor: RestHttpHeaders)
    {
        descriptor.headers = extend(descriptor.headers || {}, {"content-type": "application/json"});

        return descriptor;
    };
}
