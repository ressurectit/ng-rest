import {HttpRequest, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

import {QueryStringSerializer} from '../queryStringSerializer';
import {RestMiddleware, ɵRESTClient, RestParameters, KeyIndex, ParametersTransformsObj} from '../rest.interface';

interface ɵQueryStringSerializer
{
    ɵQueryStringSerializer?: QueryStringSerializer;
}

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
    public run(this: ɵRESTClient & ɵQueryStringSerializer,
               _id: string,
               target: RestParameters,
               methodName: string,
               _descriptor: any,
               args: any[],
               request: HttpRequest<any>,
               next: (request: HttpRequest<any>) => Observable<any>): Observable<any>
    {
        const parameters = target.parameters;
        this.ɵQueryStringSerializer = this.ɵQueryStringSerializer ?? this.injector.get(QueryStringSerializer);

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

                    queryStrings.push(this.ɵQueryStringSerializer.serializeObject(value));
                });

            queryString = queryStrings.join('&');

            const params: HttpParams = new HttpParams({fromString: queryString});
            let requestParams: HttpParams = request.params;

            params.keys().forEach(key =>
            {
                const newValues = params.getAll(key);

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
            });

            request = request.clone(
            {
                params: requestParams
            });
        }

        return next(request);
    }
}