import {Type} from '@angular/core';
import {not, RESTClient, RestMethodMiddlewares, RestMiddleware} from '@anglr/rest';

/**
 * Allows disabling of specified middleware
 * @param middleware - Middleware that will be disabled
 */
export function DisableMiddleware(middleware: Type<RestMiddleware>)
{
    return function<TDecorated>(_target: RESTClient, _propertyKey: string, descriptor: RestMethodMiddlewares |
                                                                                       TDecorated): TypedPropertyDescriptor<any>
    {
        const descr = descriptor as RestMethodMiddlewares;
        
        descr.middlewareTypes?.push(not(middleware));

        return descr;
    };
}