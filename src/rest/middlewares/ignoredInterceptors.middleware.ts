import {HttpRequest} from '@angular/common/http';
import {IgnoredInterceptorsService, AdditionalInfo, IgnoredInterceptorId} from '@anglr/common';
import {isPresent} from '@jscrpt/common';
import {Observable} from 'rxjs';

import {RestMiddleware, ɵRESTClient, RestDisabledInterceptors} from '../rest.interface';

/**
 * Middleware that is used for adding support for ignored interceptors
 */
export class IgnoredInterceptorsMiddleware implements RestMiddleware<any, any, RestDisabledInterceptors, any>
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
               id: string,
               _target: any,
               _methodName: string,
               descriptor: RestDisabledInterceptors,
               _args: any[],
               request: HttpRequest<any> & AdditionalInfo<IgnoredInterceptorId>,
               next: (request: HttpRequest<any>) => Observable<any>): Observable<any>
    {
        let ignoredInterceptorsSvc: IgnoredInterceptorsService = this.injector.get(IgnoredInterceptorsService, null);

        if(isPresent(ignoredInterceptorsSvc) && isPresent(descriptor.disabledInterceptors))
        {
            if(!request.additionalInfo)
            {
                request.additionalInfo = {};
            }

            request.additionalInfo.requestId = id;

            descriptor.disabledInterceptors.forEach(interceptorType =>
            {
                this.ignoredInterceptorsService.addInterceptor(interceptorType, request.additionalInfo);
            });
        }

        return next(request);
    }
}