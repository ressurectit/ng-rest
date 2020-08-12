import {extend} from '@jscrpt/common';

import {RESTClient} from '../common';
import {RestHttpHeaders} from '../rest.interface';

/**
 * Set custom headers for a REST method
 * @param headersDef - custom headers in a key-value pair
 */
export function Headers(headersDef: {[key: string]: string})
{
    return function(_target: RESTClient, _propertyKey: string, descriptor: RestHttpHeaders)
    {
        descriptor.headers = extend({}, headersDef, descriptor.headers);

        return descriptor;
    };
}