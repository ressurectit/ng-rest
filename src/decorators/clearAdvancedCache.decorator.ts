import {RestClearAdvancedCaching, RestMethodMiddlewares} from '../interfaces';
import {ClearAdvancedCacheMiddleware} from '../middlewares';
import type {RESTClientBase} from '../misc/classes/restClientBase';

/**
 * Clears advanced cache for key when call is successful
 * @param key - Key to be cleared on successful call
 */
export function ClearAdvancedCache(key: string)
{
    return function<TDecorated>(_target: RESTClientBase, _propertyKey: string, descriptor: RestClearAdvancedCaching &
                                                                                           RestMethodMiddlewares |
                                                                                           TDecorated): TDecorated
    {
        const descr = descriptor as RestClearAdvancedCaching & RestMethodMiddlewares;

        descr.key = key;
        descr.middlewareTypes.push(ClearAdvancedCacheMiddleware);

        return descr as TDecorated;
    };
}