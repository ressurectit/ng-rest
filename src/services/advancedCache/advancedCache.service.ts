import {Inject, Injectable} from '@angular/core';
import {HttpRequest, HttpResponse} from '@angular/common/http';
import {Dictionary, extend, isBlank} from '@jscrpt/common';

import {REST_DATE_API} from '../../misc/tokens';
import {AdvancedCacheItem, RestDateApi} from '../../interfaces';
import {AdvancedCacheItemOptions} from '../../misc/types';

/**
 * Allows advanced caching of http responses
 */
@Injectable({providedIn: 'root'})
export class AdvancedCacheService<TDate = unknown>
{
    //######################### protected fields #########################

    /**
     * Instance of cache and its data
     */
    protected cache: Dictionary<Dictionary<AdvancedCacheItem<TDate>>> = {};

    //######################### constructor #########################
    constructor(@Inject(REST_DATE_API) protected restDateApi: RestDateApi)
    {
    }

    //######################### public methods #########################

    /**
     * Clears cache either for specified key, or whole cache
     * @param key - Name of cache to be cleared, if not provided all cached items will be cleared
     */
    public clearCache(key?: string): void
    {
        if(isBlank(key))
        {
            this.cache = {};

            return;
        }

        delete this.cache[key];
    }

    /**
     * Adds response to advanced cache
     * @param key - Key under which will be cached item stored
     * @param request - Request for which will be response added
     * @param response - Response to be cached
     * @param config - Configuration for cached response
     */
    public add(key: string, request: HttpRequest<unknown>, response: HttpResponse<unknown>, config: AdvancedCacheItemOptions<TDate>): HttpResponse<unknown>
    {
        this.cache[key] ??= {};

        this.cache[key][request.urlWithParams] =
        {
            response,
            ...config
        };

        return response;
    }

    /**
     * Gets http response from cache, or null if it does not exists
     * @param key - Key which represents cached item
     * @param request - Request for which will be response returned
     */
    public get(key: string, request: HttpRequest<unknown>): HttpResponse<unknown>|null
    {
        const cachedItem = this.cache[key];

        if(!cachedItem)
        {
            return null;
        }

        const cachedData = cachedItem[request.urlWithParams];

        if(!cachedData)
        {
            return null;
        }

        if(cachedData.validUntil && !this.restDateApi.isBeforeNow(cachedData.validUntil))
        {
            delete cachedItem[request.urlWithParams];

            return null;
        }

        return cachedData.response;
    }

    /**
     * Updates existing cache items, if not exists it does nothing
     * @param key - Key which represents cached items
     * @param config - Config to be applied to existing cache items
     */
    public updateCache(key: string, config: AdvancedCacheItemOptions<TDate>): void
    {
        const cachedItem = this.cache[key];

        if(!cachedItem)
        {
            return;
        }

        Object.keys(cachedItem).forEach(url =>
        {
            const cachedData = cachedItem[url];

            extend(cachedData, config);
        });
    }
}
