import {HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';

/**
 * Definition of method that is used for passing execution to the next middleware
 */
export interface RestMiddlewareRunNextMethod<TRequestBody = unknown, TResponse = unknown>
{
    /**
     * Method that executes next middleware
     * @param request - Http request that is passed to next middleware
     */
    (request: HttpRequest<TRequestBody>): Observable<TResponse>;
}