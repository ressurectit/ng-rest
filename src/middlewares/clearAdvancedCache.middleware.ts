import {HttpRequest} from '@angular/common/http';
import {Observable, tap} from 'rxjs';

import {AdvancedCacheService} from '../services';
import {RestClearAdvancedCaching, RestMiddleware} from '../interfaces';
import type {RESTClientBase} from '../misc/classes/restClientBase';

interface ɵAdvancedCache
{
    ɵCache: AdvancedCacheService|null;
}

/**
 * Middleware that is used for clearing advanced cache for specific key
 */
export class ClearAdvancedCacheMiddleware implements RestMiddleware<unknown, unknown, RestClearAdvancedCaching>
{
    //######################### public static properties #########################

    /**
     * String identification of middleware
     */
    public static id: string = 'ClearAdvancedCacheMiddleware';

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
               descriptor: RestClearAdvancedCaching,
               _args: unknown[],
               request: HttpRequest<unknown>,
               next: (request: HttpRequest<unknown>) => Observable<unknown>): Observable<unknown>
    {
        const $this = this as unknown as ɵAdvancedCache;
        $this.ɵCache ??= this.injector.get(AdvancedCacheService, null);

        if(!$this.ɵCache)
        {
            return next(request);
        }

        return next(request).pipe(tap(() => $this.ɵCache?.clearCache(descriptor.key)));
    }
}