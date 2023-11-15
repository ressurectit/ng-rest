import {LocationHeaderResponse} from './locationHeaderResponse.interface';

/**
 * Type describing response for ResponseType.LocationHeaderAndJson
 */
export interface LocationHeaderAndJsonResponse<TData = unknown> extends LocationHeaderResponse
{
    /**
     * Deserialized json string from response body
     */
    data: TData;
}