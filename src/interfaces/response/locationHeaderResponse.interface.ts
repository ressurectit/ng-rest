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