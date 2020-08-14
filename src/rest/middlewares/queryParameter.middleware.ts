import {HttpRequest} from '@angular/common/http';
import {Dictionary} from '@jscrpt/common';
import {Observable} from 'rxjs';

import {RestMiddleware, ɵRESTClient, RestParameters, KeyIndex} from '../rest.interface';

/**
 * Middleware that is used for adding query string parameters
 */
export class QueryParameterMiddleware implements RestMiddleware
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

        let pQuery: KeyIndex[] = null;
        //TODO: add params transform
        // let pTransforms: ParametersTransformsObj = null;

        if(parameters)
        {
            pQuery = parameters[methodName]?.query;
            // pTransforms = parameters[methodName]?.transforms;
        }

        let params: Dictionary = {};

        if (pQuery)
        {
            pQuery
                .filter(p => args[p.parameterIndex]) // filter out optional parameters
                .forEach(p =>
                {
                    let key = p.key;
                    let value = args[p.parameterIndex];

                    // if the value is a instance of Object, we stringify it
                    if (value instanceof Object)
                    {
                        value = JSON.stringify(value);
                    }

                    params[key] = value;
                });

            request = request.clone(
            {
                setParams: params
            });
        }

        return next(request);
    }
}