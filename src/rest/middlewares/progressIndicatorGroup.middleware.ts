import {HttpContext, HttpRequest} from '@angular/common/http';
import {PROGRESS_INDICATOR_GROUP_NAME} from '@anglr/common';
import {isBlank} from '@jscrpt/common';
import {Observable} from 'rxjs';

import {RestMiddleware, RestProgressIndicatorGroup} from '../rest.interface';
import type {RESTClient} from '../common';

/**
 * Middleware that is used for adding support for progress indicator group passing down to progress interceptor
 */
export class ProgressIndicatorGroupMiddleware implements RestMiddleware
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
    public run(this: RESTClient,
               _id: string,
               _target: unknown,
               _methodName: string,
               descriptor: RestProgressIndicatorGroup,
               _args: unknown[],
               request: HttpRequest<unknown>,
               next: (request: HttpRequest<unknown>) => Observable<unknown>): Observable<unknown>
    {
        if(isBlank(descriptor.groupName))
        {
            return next(request);
        }

        request = request.clone(
        {
            context: new HttpContext().set(PROGRESS_INDICATOR_GROUP_NAME, descriptor.groupName)
        });

        return next(request);
    }
}