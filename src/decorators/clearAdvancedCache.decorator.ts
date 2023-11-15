import {RestClearAdvancedCaching, RestMethodMiddlewares} from '../rest/rest.interface';
import type {RESTClient} from '../rest/common';
import {ClearAdvancedCacheMiddleware} from '../middlewares';

/**
 * Clears advanced cache for key when call is successful
 * @param key - Key to be cleared on successful call
 */
export function ClearAdvancedCache(key: string)
{
    return function<TDecorated>(_target: RESTClient, _propertyKey: string, descriptor: RestClearAdvancedCaching &
                                                                                       RestMethodMiddlewares |
                                                                                       TDecorated): TypedPropertyDescriptor<any>
    {
        const descr = descriptor as RestClearAdvancedCaching & RestMethodMiddlewares;

        descr.key = key;
        descr.middlewareTypes?.push(ClearAdvancedCacheMiddleware);

        return descr;
    };
}