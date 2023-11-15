import {HttpRequest} from '@angular/common/http';
import {StringDictionary} from '@jscrpt/common';
import {Observable} from 'rxjs';

import {ParamsDataIterator} from '../misc/classes/paramsData.iterator';
import {handleQueryParam} from '../misc/utils';
import {KeyIndex, ParametersTransformsObj, RestMiddleware, RestParameters} from '../interfaces';
import type {RESTClientBase} from '../misc/classes/restClientBase';

/**
 * Middleware that is used for adding query string parameters
 */
export class QueryParameterMiddleware implements RestMiddleware<unknown, unknown, unknown, RestParameters>
{
    //######################### public static properties #########################

    /**
     * String identification of middleware
     */
    public static id: string = 'QueryParameterMiddleware';

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
                const parameters = target.parameters;

                let pQuery: KeyIndex[]|undefined;
                let pTransforms: ParametersTransformsObj|undefined;
        
                if(parameters)
                {
                    pQuery = parameters[methodName]?.query;
                    pTransforms = parameters[methodName]?.transforms;
                }
        
                if(pQuery)
                {
                    const params: StringDictionary = {};
        
                    for(const data of new ParamsDataIterator(pQuery, pTransforms, args, this))
                    {
                        await handleQueryParam(data, params, args);
                    }
        
                    request = request.clone(
                    {
                        setParams: params
                    });
                }
        
                return next(request).subscribe(observer);
            })();
        });
    }
}