import {HttpRequest} from '@angular/common/http';
import {IgnoredInterceptorsService, AdditionalInfo, IgnoredInterceptorId} from '@anglr/common';
import {isBlank} from '@jscrpt/common';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

import {RestMiddleware, ɵRESTClient, RestDisabledInterceptors} from '../rest.interface';

interface ɵIgnoredInterceptor
{
    ɵIgnoredInterceptorsService?: IgnoredInterceptorsService;
}

/**
 * Middleware that is used for adding support for ignored interceptors
 */
export class IgnoredInterceptorsMiddleware implements RestMiddleware
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
    public run(this: ɵRESTClient & ɵIgnoredInterceptor,
               id: string,
               _target: any,
               _methodName: string,
               descriptor: RestDisabledInterceptors,
               _args: any[],
               request: HttpRequest<any> & AdditionalInfo<IgnoredInterceptorId>,
               next: (request: HttpRequest<any>) => Observable<any>): Observable<any>
    {
        this.ɵIgnoredInterceptorsService = this.ɵIgnoredInterceptorsService ?? this.injector.get(IgnoredInterceptorsService, null);

        if(isBlank(this.ɵIgnoredInterceptorsService) || isBlank(descriptor.disabledInterceptors))
        {
            return next(request);
        }

        request.additionalInfo = request.additionalInfo ?? {};
        request.additionalInfo.requestId = id;

        descriptor.disabledInterceptors.forEach(interceptorType =>
        {
            this.ɵIgnoredInterceptorsService.addInterceptor(interceptorType, request.additionalInfo);
        });

        let clear = () => this.ɵIgnoredInterceptorsService.clear();

        return next(request)
            .pipe(tap(clear, clear, clear));
    }
}