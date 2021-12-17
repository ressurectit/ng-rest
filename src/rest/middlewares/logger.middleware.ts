import {HttpRequest} from '@angular/common/http';
import {AdditionalInfo, Logger, LOGGER} from '@anglr/common';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

import {RestMiddleware, ɵRESTClient} from '../rest.interface';

interface ɵLogger
{
    ɵLogger?: Logger;
}

/**
 * Middleware that is used for logging requests and responses
 */
export class LoggerMiddleware implements RestMiddleware
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
    public run(this: ɵRESTClient & ɵLogger,
               _id: string,
               _target: any,
               methodName: string,
               _descriptor: any,
               args: any[],
               request: HttpRequest<any> & AdditionalInfo,
               next: (request: HttpRequest<any>) => Observable<any>): Observable<any>
    {
        this.ɵLogger = this.ɵLogger ?? this.injector.get(LOGGER, null);

        if(!this.ɵLogger)
        {
            return next(request);
        }

        this.ɵLogger.verbose(`RESTClient ${methodName}: Request {@request}`, 
        {
            args,
            request
        });

        return next(request)
            .pipe(tap(response =>
                      {
                          this.ɵLogger.verbose(`RESTClient ${methodName}: Response {@response}`, response);
                      },
                      error =>
                      {
                          this.ɵLogger.verbose(`RESTClient ${methodName}: ErrorResponse {@error}`, error);
                      }));
    }
}