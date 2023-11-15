import {RestAdvancedCaching, RestMethodMiddlewares} from '../interfaces';
import {AdvancedCacheMiddleware} from '../middlewares';
import type {RESTClientBase} from '../misc/classes/restClientBase';

/**
 * Name of default key if not specified custom one
 */
const DEFAULT_KEY = 'ɵDEFAULTɵ';

/**
 * Results of requests are cached in advanced cachce service
 * @param key - Optional key for cached data
 * @param validUntil - Relative definition of 'date' for setting validity of cache, example +2d, +12h
 */
export function AdvancedCache(key?: string|null, validUntil?: string|null)
{
    return function<TDecorated>(_target: RESTClientBase, _propertyKey: string, descriptor: RestAdvancedCaching &
                                                                                           RestMethodMiddlewares |
                                                                                           TDecorated): TDecorated
    {
        const descr = descriptor as RestMethodMiddlewares & RestAdvancedCaching;
        descr.key = key ?? DEFAULT_KEY;
        descr.validUntil = validUntil;

        descr.middlewareTypes.push(AdvancedCacheMiddleware);
        
        return descr as TDecorated;
    };
}