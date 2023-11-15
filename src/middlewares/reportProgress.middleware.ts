import {HttpRequest, HttpEventType, HttpResponse} from '@angular/common/http';
import {Observable, filter} from 'rxjs';

import {RestMiddleware, RestReportProgress} from '../interfaces';
import type {RESTClientBase} from '../misc/classes/restClientBase';

/**
 * Middleware that is used for handling report progress setting, if not set returns only final http response with data
 */
export class ReportProgressMiddleware implements RestMiddleware<unknown, unknown, RestReportProgress, unknown, HttpResponse<unknown>>
{
    //######################### public static properties #########################

    /**
     * String identification of middleware
     */
    public static id: string = 'ReportProgressMiddleware';

    //######################### public methods - implementation of RestMiddleware #########################

    /**
     * Runs code that is defined for this rest middleware, in this method you can modify request and response
     * @param this - Method is bound to RESTClient
     * @param id - Unique id that identifies request method
     * @param target - Prototype of class that are decorators applied to
     * @param methodName - Name of method that is being modified
     * @param descriptor - Descriptor of method that is being modified
     * @param args - Array of arguments passed to called method
     * @param request - Http request that you can modify
     * @param next - Used for calling next middleware with modified request
     */
    public run(this: RESTClientBase,
               _id: string,
               _target: unknown,
               _methodName: string,
               descriptor: RestReportProgress,
               _args: unknown[],
               request: HttpRequest<unknown>,
               next: (request: HttpRequest<unknown>) => Observable<HttpResponse<unknown>>): Observable<unknown>
    {
        if(descriptor.reportProgress)
        {
            request = request.clone(
            {
                reportProgress: true
            });
        }

        return next(request)
            .pipe(filter(response => descriptor.reportProgress ? true : response.type == HttpEventType.Response));
    }
}