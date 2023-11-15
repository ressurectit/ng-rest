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