import {HttpRequest, HttpResponse} from '@angular/common/http';
import {isPresent} from '@jscrpt/common';
import {Observable, of, map} from 'rxjs';

import {AdvancedCacheService} from '../services';
import {RestAdvancedCaching, RestMiddleware} from '../interfaces';
import type {RESTClientBase} from '../misc/classes/restClientBase';

interface ɵAdvancedCache
{
    ɵCache: AdvancedCacheService|null;
}

/**
 * Middleware that is used for storing and restoring response from advanced cache service
 */
export class AdvancedCacheMiddleware implements RestMiddleware<unknown, unknown, RestAdvancedCaching, unknown, HttpResponse<unknown>>
{
    //######################### public static properties #########################

    /**
     * String identification of middleware
     */
    public static id: string = 'AdvancedCacheMiddleware';

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
               descriptor: RestAdvancedCaching,
               _args: unknown[],
               request: HttpRequest<unknown>,
               next: (request: HttpRequest<unknown>) => Observable<HttpResponse<unknown>>): Observable<unknown>
    {
        const $this = this as unknown as ɵAdvancedCache;
        $this.ɵCache ??= this.injector.get(AdvancedCacheService, null);

        if(!$this.ɵCache)
        {
            return next(request);
        }

        const cachedResponse: HttpResponse<unknown>|null = $this.ɵCache.get(descriptor.key, request);

        if (isPresent(cachedResponse))
        {
            return of(cachedResponse);
        }

        return next(request).pipe(map(response => $this.ɵCache?.add(descriptor.key, request, response, {validUntil: descriptor.validUntil})));
    }
}