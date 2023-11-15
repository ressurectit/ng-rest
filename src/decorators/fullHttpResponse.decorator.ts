import type {RESTClient} from '../rest/common';
import {RestMethodMiddlewares} from '../rest/rest.interface';
import {not} from '../misc/utils';
import {ResponseTypeMiddleware} from '../middlewares/responseType.middleware';

/**
 * Allows method to return full HttpResponse with requested response type body
 */
export function FullHttpResponse()
{
    return function<TDecorated>(_target: RESTClient, _propertyKey: string, descriptor: RestMethodMiddlewares | TDecorated): TypedPropertyDescriptor<any>
    {
        const descr = descriptor as RestMethodMiddlewares;

        descr.middlewareTypes?.push(not(ResponseTypeMiddleware));

        return descr;
    };
}