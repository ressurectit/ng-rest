import {HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';

import type {RESTClient} from '../common';
import {RestMiddleware, RestParameters, KeyIndex, ParametersTransformsObj} from '../rest.interface';

/**
 * Middleware that is used for adding body to request
 */
export class BodyParameterMiddleware implements RestMiddleware
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
               target: RestParameters,
               methodName: string,
               _descriptor: unknown,
               args: unknown[],
               request: HttpRequest<unknown>,
               next: (request: HttpRequest<unknown>) => Observable<unknown>): Observable<unknown>
    {
        const parameters = target.parameters;

        let pBody: KeyIndex[]|undefined;
        let pTransforms: ParametersTransformsObj|undefined;

        if(parameters)
        {
            pBody = parameters[methodName]?.body;
            pTransforms = parameters[methodName]?.transforms;
        }

        if (pBody)
        {
            let body = args[pBody[0].parameterIndex];

            if(pTransforms && pTransforms[pBody[0].parameterIndex])
            {
                body = pTransforms[pBody[0].parameterIndex].bind(this)(body);
            }

            request = request.clone(
            {
                body
            });
        }

        return next(request);
    }
}