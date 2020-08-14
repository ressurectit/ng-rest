import {HttpRequest, HttpParams} from '@angular/common/http';
import {Dictionary} from '@jscrpt/common';
import {Observable} from 'rxjs';
import param from 'jquery-param';

import {RestMiddleware, ɵRESTClient, RestParameters, KeyIndex, ParametersTransformsObj} from '../rest.interface';

/**
 * Middleware that is used for adding query string from query object
 */
export class QueryObjectParameterMiddleware implements RestMiddleware
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

        let pQueryObject: KeyIndex[] = null;
        let pTransforms: ParametersTransformsObj = null;

        if(parameters)
        {
            pQueryObject = parameters[methodName]?.queryObject;
            pTransforms = parameters[methodName]?.transforms;
        }

        if (pQueryObject)
        {
            let queryString: string = "";

            pQueryObject
                .filter(p => args[p.parameterIndex]) // filter out optional parameters
                .forEach(p =>
                {
                    let value = args[p.parameterIndex];

                    if(pTransforms && pTransforms[p.parameterIndex])
                    {
                        value = pTransforms[p.parameterIndex].bind(this)(value);
                    }

                    // if the value is a instance of Object, we stringify it
                    if (value instanceof Object)
                    {
                        queryString += (queryString.length > 0 ? "&" : "") + param(value)
                            .replace(/&&/g, "&")
                            .replace(/%5B%5D/g, "")
                            .replace(/%5D/g, "")
                            .replace(/%5B/g, ".")
                            .replace(/\.(\d+)\./g, "%5B$1%5D.");
                    }
                });

            queryString = queryString.replace(/\w+=(&|$)/g, "")
                                     .replace(/(&|\?)$/g, "");

            let dictionary: Dictionary = {};
            let params: HttpParams = new HttpParams({fromString: queryString});

            params.keys().forEach(key =>
            {
                dictionary[key] = params.get(key);
            });

            request = request.clone(
            {
                setParams: dictionary
            });
        }

        return next(request);
    }
}