import {HttpResponse} from '@angular/common/http';

/**
 * Advanced cache item
 */
export interface AdvancedCacheItem<TDate = unknown>
{
    /**
     * Cached http response
     */
    response: HttpResponse<unknown>;

    /**
     * Validity date for cache
     */
    validUntil: TDate|null;
}
