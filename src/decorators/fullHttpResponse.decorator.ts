import {not} from '../misc/utils';
import {ResponseTypeMiddleware} from '../middlewares/responseType.middleware';
import type {RESTClientBase} from '../misc/classes/restClientBase';
import {RestMethodMiddlewares} from '../interfaces';

/**
 * Allows method to return full HttpResponse with requested response type body
 */
export function FullHttpResponse()
{
    return function<TDecorated>(_target: RESTClientBase, _propertyKey: string, descriptor: RestMethodMiddlewares | TDecorated): TDecorated
    {
        const descr = descriptor as RestMethodMiddlewares;

        descr.middlewareTypes.push(not(ResponseTypeMiddleware));

        return descr as TDecorated;
    };
}