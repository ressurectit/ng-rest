import {HttpRequest} from '@angular/common/http';
import {isPresent} from '@jscrpt/common';
import {Observable} from 'rxjs';

import {RestMiddleware, ɵRESTClient, RestParameters, KeyIndex, ParametersTransformsObj} from '../rest.interface';

/**
 * Middleware that is used for modifying request URL path
 */
export class PathParameterMiddleware implements RestMiddleware
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
               target: RestParameters,
               methodName: string,
               _descriptor: any,
               args: any[],
               request: HttpRequest<any>,
               next: (request: HttpRequest<any>) => Observable<any>): Observable<any>
    {
        const parameters = target.parameters;

        let pPath: KeyIndex[] = null;
        let pTransforms: ParametersTransformsObj = null;

        if(parameters)
        {
            pPath = parameters[methodName]?.path;
            pTransforms = parameters[methodName]?.transforms;
        }

        var url: string = request.url;

        if (pPath && isPresent(url))
        {
            for (var k in pPath)
            {
                if (pPath.hasOwnProperty(k))
                {
                    let value = args[pPath[k].parameterIndex];

                    if(pTransforms && pTransforms[pPath[k].parameterIndex])
                    {
                        value = pTransforms[pPath[k].parameterIndex].bind(this)(value);
                    }

                    url = url.replace("{" + pPath[k].key + "}", value);
                }
            }

            request = request.clone(
            {
                url
            });
        }

        return next(request);
    }
}