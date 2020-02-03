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
 * Type describing response for ResponseType.BlobAndFilename
 */
export interface BlobAndFilenameResponse
{
    /**
     * Content of the downloaded file
     */
    blob: Blob,

    /**
     * Name of the file that is being downloaded
     */
    filename: string
}

/**
 * Supported Produces response types
 */
export enum ResponseType
{
    Json,
    Text,
    Blob,
    BlobAndFilename,
    ArrayBuffer,
    LocationHeader,
    LocationHeaderAndJson
}