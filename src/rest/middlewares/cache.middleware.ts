import {HttpRequest, HttpResponse} from '@angular/common/http';
import {isPresent} from '@jscrpt/common';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';

import {RestMiddleware, ɵRESTClient, RestCaching} from '../rest.interface';

/**
 * Middleware that is used for storing and restoring response from cache
 */
export class CacheMiddleware implements RestMiddleware
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
               descriptor: RestCaching,
               _args: any[],
               request: HttpRequest<any>,
               next: (request: HttpRequest<any>) => Observable<any>): Observable<any>
    {
        if(!descriptor.getCachedResponse || !descriptor.saveResponseToCache)
        {
            return next(request);
        }

        const cachedResponse: HttpResponse<any> = descriptor.getCachedResponse(request);

        if (isPresent(cachedResponse))
        {
            return of(cachedResponse);
        }

        return next(request).pipe(map(response => descriptor.saveResponseToCache(request, response)));
    }
}