import {RESTClient} from '../common';
import {RestFullHttpResponse} from '../rest.interface';

/**
 * Allows method to return full HttpResponse with requested response type body
 */
export function FullHttpResponse()
{
    return function(_target: RESTClient, _propertyKey: string, descriptor: RestFullHttpResponse)
    {
        descriptor.fullHttpResponse = true;

        return descriptor;
    };
}