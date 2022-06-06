import {HttpRequest} from '@angular/common/http';
import {isPresent, StringDictionary} from '@jscrpt/common';
import {Observable} from 'rxjs';

import type {RESTClient} from '../common';
import {RestMiddleware, RestParameters, KeyIndex, ParametersTransformsObj} from '../rest.interface';

/**
 * Middleware that is used for adding header from parameter
 */
export class HeaderParameterMiddleware implements RestMiddleware
{
    //######################### public static properties #########################

    /**
     * String identification of middleware
     */
    public static id: string = 'HeaderParameterMiddleware';

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
               args: any[],
               request: HttpRequest<unknown>,
               next: (request: HttpRequest<unknown>) => Observable<unknown>): Observable<unknown>
    {
        const parameters = target.parameters;

        let pHeader: KeyIndex[]|undefined;
        let pTransforms: ParametersTransformsObj|undefined;

        if(parameters)
        {
            pHeader = parameters[methodName]?.header;
            pTransforms = parameters[methodName]?.transforms;
        }

        if (pHeader)
        {
            const headers: StringDictionary = {};

            for (const k in pHeader)
            {
                if (isPresent(pHeader[k]))
                {
                    let value = args[pHeader[k].parameterIndex];

                    if(pTransforms && pTransforms[pHeader[k].parameterIndex])
                    {
                        value = pTransforms[pHeader[k].parameterIndex].bind(this)(value);
                    }

                    headers[pHeader[k].key] = value;
                }
            }

            request = request.clone(
            {
                setHeaders: headers
            });
        }

        return next(request);
    }
}