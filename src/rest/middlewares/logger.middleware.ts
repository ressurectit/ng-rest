import {HttpRequest} from '@angular/common/http';
import {Logger, LOGGER} from '@anglr/common';
import {Observable, tap} from 'rxjs';

import {RestMiddleware} from '../rest.interface';
import type {RESTClient} from '../common';

interface ɵLogger
{
    ɵLogger: Logger|null;
}

/**
 * Middleware that is used for logging requests and responses
 */
export class LoggerMiddleware implements RestMiddleware
{
    //######################### public static properties #########################

    /**
     * String identification of middleware
     */
    public static id: string = 'LoggerMiddleware';

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
    public run(this: RESTClient,
               _id: string,
               _target: unknown,
               methodName: string,
               _descriptor: unknown,
               args: unknown[],
               request: HttpRequest<unknown>,
               next: (request: HttpRequest<unknown>) => Observable<unknown>): Observable<unknown>
    {
        const $this = this as unknown as ɵLogger;
        $this.ɵLogger = $this.ɵLogger ?? this.injector.get(LOGGER, null);

        if(!$this.ɵLogger)
        {
            return next(request);
        }

        $this.ɵLogger.verbose(`RESTClient ${methodName}: Request {{@request}}`, 
        {
            request:
            {
                args,
                request,
            }
        });

        return next(request)
            .pipe(tap(
            {
                next: response =>
                {
                    $this.ɵLogger?.verbose(`RESTClient ${methodName}: Response {{@response}}`, {response});
                },
                error: error =>
                {
                    $this.ɵLogger?.verbose(`RESTClient ${methodName}: ErrorResponse {{@error}}`, {error});
                }
            }));
    }
}