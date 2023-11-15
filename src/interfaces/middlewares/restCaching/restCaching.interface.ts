import {HttpRequest, HttpResponse} from '@angular/common/http';

/**
 * Contains methods used for handling 'caching'
 */
export interface RestCaching extends TypedPropertyDescriptor<unknown>
{
    /**
     * Gets response from cache
     * @param request - Http request that is tested whether it is in cache
     */
    getCachedResponse: (request: HttpRequest<unknown>) => HttpResponse<unknown>|null;

    /**
     * Saves response to cache for provided request and returns this response
     * @param request - Request that is identifies response
     * @param response - Response to be cached
     */
    saveResponseToCache: (request: HttpRequest<unknown>, response: HttpResponse<unknown>) => HttpResponse<unknown>;
}
