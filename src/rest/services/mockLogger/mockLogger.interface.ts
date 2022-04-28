import {HttpRequest, HttpResponse} from '@angular/common/http';

/**
 * Service for logging mock responses
 */
export interface MockLogger
{
    /**
     * Logs mock response
     * @param request - Request to be used for logging
     * @param response - Response to be used for logging
     */
    logResponse(request: HttpRequest<unknown>, response: HttpResponse<string|ArrayBuffer|Blob|object>): Promise<void>;
}