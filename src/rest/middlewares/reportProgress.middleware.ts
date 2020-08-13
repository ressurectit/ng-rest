import {HttpRequest, HttpEvent, HttpEventType} from '@angular/common/http';
import {Observable} from 'rxjs';
import {filter} from 'rxjs/operators';

import {RestMiddleware, ɵRESTClient, RestReportProgress} from '../rest.interface';

/**
 * Middleware that is used for handling report progress setting, if not set returns only final http response with data
 */
export class ReportProgressMiddleware implements RestMiddleware<any, any, RestReportProgress, any>
{
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
    public run(this: ɵRESTClient,
               _id: string,
               _target: any,
               _methodName: string,
               descriptor: RestReportProgress,
               _args: any[],
               request: HttpRequest<any>,
               next: <TNextRequestBody = any, TNextResponseBody = HttpEvent<any> | any>(request: HttpRequest<TNextRequestBody>) => Observable<TNextResponseBody>): Observable<any>
    {
        let reportProgress = descriptor.reportProgress ?? false;

        if(reportProgress)
        {
            request = request.clone(
            {
                reportProgress: reportProgress
            });
        }

        return next(request)
            .pipe(filter(result => reportProgress ? true : (result.type == HttpEventType.Response)));
    }
}