import {HttpRequest} from '@angular/common/http';
import {StringDictionary} from '@jscrpt/common';
import {Observable} from 'rxjs';

import {RestMiddleware, ɵRESTClient, RestParameters, KeyIndex} from '../rest.interface';

/**
 * Middleware that is used for adding header from parameter
 */
export class HeaderParameterMiddleware implements RestMiddleware
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
        let parameters = target.parameters;

        let pHeader: KeyIndex[] = null;
        //TODO: add support for param transform
        // let pTransforms: ParametersTransformsObj = null;

        if(parameters)
        {
            pHeader = parameters[methodName]?.header;
            // pTransforms = parameters[methodName]?.transforms;
        }

        if (pHeader)
        {
            let headers: StringDictionary = {};

            for (var k in pHeader)
            {
                if (pHeader.hasOwnProperty(k))
                {
                    headers[pHeader[k].key] = args[pHeader[k].parameterIndex];
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