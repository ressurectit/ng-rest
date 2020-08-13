import {HttpRequest} from '@angular/common/http';
import {AdditionalInfo} from '@anglr/common';
import {Observable} from 'rxjs';

import {RestMiddleware, ɵRESTClient, AdditionalInfoPropertyDescriptor} from '../rest.interface';

/**
 * Middleware that is used for adding support for additional info to request from decorators
 */
export class AdditionalDataMiddleware implements RestMiddleware
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
               descriptor: AdditionalInfoPropertyDescriptor,
               _args: any[],
               request: HttpRequest<any> & AdditionalInfo,
               next: (request: HttpRequest<any>) => Observable<any>): Observable<any>
    {
        if(!descriptor.additionalInfo)
        {
            return next(request);
        }

        request.additionalInfo = request.additionalInfo ?? {};

        Object.keys(descriptor.additionalInfo).forEach(key =>
        {
            request.additionalInfo[key] = descriptor.additionalInfo[key];
        });

        return next(request);
    }
}