import {HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';

import type {RESTClientBase} from '../../misc/classes/restClientBase';

/**
 * Definition of method that is used for running middleware code
 */
export interface RestMiddlewareRunMethod<TRequestBody = unknown, TResponseBody = unknown, TDescriptor = unknown, TTarget = unknown>
{
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
    (this: RESTClientBase,
     id: string,
     target: TTarget,
     methodName: string,
     descriptor: TDescriptor,
     args: unknown[],
     request: HttpRequest<TRequestBody>,
     next: <TNextRequestBody = unknown, TNextResponseBody = unknown>(request: HttpRequest<TNextRequestBody>) => Observable<TNextResponseBody>): Observable<TResponseBody>;
}