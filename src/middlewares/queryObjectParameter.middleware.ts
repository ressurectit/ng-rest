import {HttpRequest, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

import {ParamsDataIterator} from '../misc/classes/paramsData.iterator';
import {QueryStringSerializer} from '../misc/classes/queryStringSerializer';
import {handleQueryObjectParam, mergeQueryObjectParamsWithHttpParams} from '../misc/utils';
import {KeyIndex, ParametersTransformsObj, RestMiddleware, RestParameters} from '../interfaces';
import type {RESTClientBase} from '../misc/classes/restClientBase';

interface ɵQueryStringSerializer
{
    ɵQueryStringSerializer: QueryStringSerializer;
}

/**
 * Middleware that is used for adding query string from query object
 */
export class QueryObjectParameterMiddleware implements RestMiddleware<unknown, unknown, unknown, RestParameters>
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
    public run(this: RESTClientBase,
               _id: string,
               target: RestParameters,
               methodName: string,
               _descriptor: unknown,
               args: unknown[],
               request: HttpRequest<unknown>,
               next: (request: HttpRequest<unknown>) => Observable<unknown>): Observable<unknown>
    {
        return new Observable(observer =>
        {
            (async () =>
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
                    const queryStrings: string[] = [];
        
                    for(const data of new ParamsDataIterator(pQueryObject, pTransforms, args, this))
                    {
                        await handleQueryObjectParam(data, queryStrings, $this.ɵQueryStringSerializer, args);
                    }
        
                    const requestParams: HttpParams = mergeQueryObjectParamsWithHttpParams(queryStrings, request.params);
        
                    request = request.clone(
                    {
                        params: requestParams
                    });
                }
        
                return next(request).subscribe(observer);
            })();
        });
    }
}