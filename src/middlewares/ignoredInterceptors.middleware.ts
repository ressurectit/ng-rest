import {HttpContext, HttpRequest} from '@angular/common/http';
import {IGNORED_INTERCEPTORS} from '@anglr/common';
import {isBlank} from '@jscrpt/common';
import {Observable} from 'rxjs';

import {RestDisabledInterceptors, RestMiddleware} from '../interfaces';
import type {RESTClientBase} from '../misc/classes/restClientBase';

/**
 * Middleware that is used for adding support for ignored interceptors
 */
export class IgnoredInterceptorsMiddleware implements RestMiddleware<unknown, unknown, RestDisabledInterceptors>
{
    //######################### public static properties #########################

    /**
     * String identification of middleware
     */
    public static id: string = 'IgnoredInterceptorsMiddleware';

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
               descriptor: RestDisabledInterceptors,
               _args: unknown[],
               request: HttpRequest<unknown>,
               next: (request: HttpRequest<unknown>) => Observable<unknown>): Observable<unknown>
    {
        if(isBlank(descriptor.disabledInterceptors))
        {
            return next(request);
        }

        request = request.clone(
        {
            context: new HttpContext().set(IGNORED_INTERCEPTORS, descriptor.disabledInterceptors)
        });

        return next(request);
    }
}