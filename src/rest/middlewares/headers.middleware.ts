import {HttpRequest} from '@angular/common/http';
import {isBlank, isPresent, StringDictionary} from '@jscrpt/common';
import {Observable} from 'rxjs';

import type {RESTClient} from '../common';
import {RestMiddleware, RestHttpHeaders} from '../rest.interface';

/**
 * Middleware that is used for setting custom http headers
 */
export class HeadersMiddleware implements RestMiddleware
{
    //######################### public static properties #########################

    /**
     * String identification of middleware
     */
    public static id: string = 'HeadersMiddleware';

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
               descriptor: RestHttpHeaders,
               _args: unknown[],
               request: HttpRequest<unknown>,
               next: (request: HttpRequest<unknown>) => Observable<unknown>): Observable<unknown>
    {
        if(isBlank(descriptor.headers))
        {
            return next(request);
        }

        const headers: StringDictionary = {};
        
        // set method specific headers
        for (const k in descriptor.headers)
        {
            if (isPresent(descriptor.headers[k]))
            {
                headers[k] = descriptor.headers[k];
            }
        }

        request = request.clone(
        {
            setHeaders: headers
        });

        return next(request);
    }
}