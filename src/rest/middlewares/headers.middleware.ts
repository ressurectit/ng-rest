import {HttpRequest} from '@angular/common/http';
import {isBlank, Dictionary} from '@jscrpt/common';
import {Observable} from 'rxjs';

import {RestMiddleware, ɵRESTClient, RestHttpHeaders} from '../rest.interface';

/**
 * Middleware that is used for setting custom http headers
 */
export class HeadersMiddleware implements RestMiddleware
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
               descriptor: RestHttpHeaders,
               _args: any[],
               request: HttpRequest<any>,
               next: (request: HttpRequest<any>) => Observable<any>): Observable<any>
    {
        if(isBlank(descriptor.headers))
        {
            return next(request);
        }

        let headers: Dictionary = {};
        
        // set method specific headers
        for (let k in descriptor.headers)
        {
            if (descriptor.headers.hasOwnProperty(k))
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