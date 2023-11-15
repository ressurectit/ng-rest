import {RestMethodMiddlewares, RestMiddleware} from '../interfaces';
import type {RESTClientBase} from '../misc/classes/restClientBase';
import {RestMiddlewareType} from '../misc/types';
import {not} from '../misc/utils';

/**
 * Allows disabling of specified middleware
 * @param middleware - Middleware that will be disabled
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DisableMiddleware(middleware: RestMiddlewareType<RestMiddleware<any, any, any, any, any>>)
{
    return function<TDecorated>(_target: RESTClientBase, _propertyKey: string, descriptor: RestMethodMiddlewares |
                                                                                           TDecorated): TDecorated
    {
        const descr = descriptor as RestMethodMiddlewares;
        
        descr.middlewareTypes.push(not(middleware));

        return descr as TDecorated;
    };
}