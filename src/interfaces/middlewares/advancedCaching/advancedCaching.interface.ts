import {RestClearAdvancedCaching} from '../clearAdvancedCaching/clearAdvancedCaching.interface';

/**
 * Contains data that are used for advanced cache service
 */
export interface RestAdvancedCaching extends RestClearAdvancedCaching
{
    /**
     * Relative definition of 'date' for setting validity of cache, example +2d, +12h
     */
    validUntil: string|undefined|null;
}
