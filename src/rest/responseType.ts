/**
 * Type describing response for ResponseType.LocationHeader
 */
export interface LocationHeaderResponse
{
    /**
     * Value of 'location' header from response
     */
    location: string;

    /**
     * Guessed id of new record from 'location' header
     */
    id: string;
}

/**
 * Type describing response for ResponseType.LocationHeaderAndJson
 */
export interface LocationHeaderAndJsonResponse<TData> extends LocationHeaderResponse
{
    /**
     * Deserialized json string from response body
     */
    data: TData;
}

/**
 * Supported @Produces response types
 */
export enum ResponseType
{
    Json,
    Text,
    Blob,
    ArrayBuffer,
    LocationHeader,
    LocationHeaderAndJson
}