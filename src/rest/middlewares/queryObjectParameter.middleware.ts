import {HttpRequest, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

import type {RESTClient} from '../common';
import {QueryStringSerializer} from '../queryStringSerializer';
import {RestMiddleware, RestParameters, KeyIndex, ParametersTransformsObj} from '../rest.interface';

interface ɵQueryStringSerializer
{
    ɵQueryStringSerializer: QueryStringSerializer;
}

/**
 * Middleware that is used for adding query string from query object
 */
export class QueryObjectParameterMiddleware implements RestMiddleware
{
    //######################### public static properties #########################

    /**
     * String identification of middleware
     */
    public static id: string = 'QueryObjectParameterMiddleware';

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
        const $this = this as unknown as ɵQueryStringSerializer;
        const parameters = target.parameters;
        $this.ɵQueryStringSerializer = $this.ɵQueryStringSerializer ?? this.injector.get(QueryStringSerializer);

        let pQueryObject: KeyIndex[]|undefined;
        let pTransforms: ParametersTransformsObj|undefined;

        if(parameters)
        {
            pQueryObject = parameters[methodName]?.queryObject;
            pTransforms = parameters[methodName]?.transforms;
        }

        if (pQueryObject)
        {
            let queryString: string = '';
            const queryStrings: string[] = [];

            pQueryObject
                .filter(p => args[p.parameterIndex]) // filter out optional parameters
                .forEach(p =>
                {
                    let value = args[p.parameterIndex];

                    if(pTransforms && pTransforms[p.parameterIndex])
                    {
                        value = pTransforms[p.parameterIndex].bind(this)(value);
                    }

                    const serializedObj = $this.ɵQueryStringSerializer.serializeObject(value);

                    if(serializedObj)
                    {
                        queryStrings.push(serializedObj);
                    }
                });

            queryString = queryStrings.join('&');

            const params: HttpParams = new HttpParams({fromString: queryString});
            let requestParams: HttpParams = request.params;

            params.keys().forEach(key =>
            {
                const newValues = params.getAll(key);

                if(newValues)
                {
                    newValues.forEach((value, index) =>
                    {
                        //first item, set
                        if(!index)
                        {
                            requestParams = requestParams.set(key, value);
                        }
                        //rest append
                        else
                        {
                            requestParams = requestParams.append(key, value);
                        }
                    });
                }
            });

            request = request.clone(
            {
                params: requestParams
            });
        }

        return next(request);
    }
}