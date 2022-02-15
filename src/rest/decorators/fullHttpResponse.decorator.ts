import {RESTClient} from '../common';
import {RestMethodMiddlewares} from '../rest.interface';
import {not} from '../utils';
import {ResponseTypeMiddleware} from '../middlewares/responseType.middleware';

/**
 * Allows method to return full HttpResponse with requested response type body
 */
export function FullHttpResponse()
{
    return function(_target: RESTClient, _propertyKey: string, descriptor: RestMethodMiddlewares): TypedPropertyDescriptor<any>
    {
        descriptor.middlewareTypes?.push(not(ResponseTypeMiddleware));

        return descriptor;
    };
}