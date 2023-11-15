import {RestMethodMiddlewares, RestMiddleware, RestMiddlewareType} from '../rest/rest.interface';
import {RESTClient} from '../rest/common';
import {not} from '../misc/utils';

/**
 * Allows disabling of specified middleware
 * @param middleware - Middleware that will be disabled
 */
export function DisableMiddleware(middleware: RestMiddlewareType<RestMiddleware>)
{
    return function<TDecorated>(_target: RESTClient, _propertyKey: string, descriptor: RestMethodMiddlewares |
                                                                                       TDecorated): TypedPropertyDescriptor<any>
    {
        const descr = descriptor as RestMethodMiddlewares;
        
        descr.middlewareTypes?.push(not(middleware));

        return descr;
    };
}