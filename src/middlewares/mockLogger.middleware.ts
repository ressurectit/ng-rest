import {HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable, tap} from 'rxjs';

import {REST_MOCK_LOGGER} from '../misc/tokens';
import {MockLogger, RestMiddleware} from '../interfaces';
import type {RESTClientBase} from '../misc/classes/restClientBase';

interface ɵMockLogger
{
    ɵMockLogger: MockLogger|null;
}

/**
 * Middleware that is used for logging responses for mock usages
 * 
 * @example
 * Change providers for `REST_METHOD_MIDDLEWARES` that way, that you add `...jsDevMode ? [MockLoggerMiddleware] : []` to `REST_METHOD_MIDDLEWARES`
 * 
 * For example
 * 
 * ```ts
 *  <ValueProvider>
 *  {
 *      provide: REST_METHOD_MIDDLEWARES,
 *      useValue:
 *      [
 *          LoggerMiddleware,
 *          ResponseTypeMiddleware,
 *          ReportProgressMiddleware,
 *          ...jsDevMode ? [MockLoggerMiddleware] : [],
 *      ]
 *  },
 * ```
 */
export class MockLoggerMiddleware implements RestMiddleware<unknown, unknown, unknown, unknown, HttpResponse<string|ArrayBuffer|Blob|object>>
{
    //######################### public static properties #########################

    /**
     * String identification of middleware
     */
    public static id: string = 'MockLoggerMiddleware';

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
               _descriptor: unknown,
               _args: unknown[],
               request: HttpRequest<unknown>,
               next: (request: HttpRequest<unknown>) => Observable<HttpResponse<string|ArrayBuffer|Blob|object>>): Observable<unknown>
    {
        if(!jsDevMode)
        {
            return next(request);
        }
        else
        {
            const $this = this as unknown as ɵMockLogger;
            $this.ɵMockLogger ??= this.injector.get(REST_MOCK_LOGGER, null);
    
            if(!$this.ɵMockLogger)
            {
                return next(request);
            }
    
            return next(request)
                .pipe(tap(response => $this.ɵMockLogger?.logResponse(request, response)));
        }
    }
}