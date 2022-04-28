import {HttpResponse} from '@angular/common/http';

/**
 * Advanced cache item
 */
export interface AdvancedCacheItem<TDate = any>
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

/**
 * Options for advanced cache item
 */
export type AdvancedCacheItemOptions<TDate = any> = Omit<AdvancedCacheItem<TDate>, 'response'>;
