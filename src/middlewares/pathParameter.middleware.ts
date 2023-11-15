import {HttpRequest} from '@angular/common/http';
import {isPresent} from '@jscrpt/common';
import {Observable} from 'rxjs';

import {ParamsDataIterator} from '../misc/classes/paramsData.iterator';
import {handlePathParam} from '../misc/utils';
import {KeyIndex, ParametersTransformsObj, RestMiddleware, RestParameters} from '../interfaces';
import type {RESTClientBase} from '../misc/classes/restClientBase';

/**
 * Middleware that is used for modifying request URL path
 */
export class PathParameterMiddleware implements RestMiddleware<unknown, unknown, unknown, RestParameters>
{
    //######################### public static properties #########################

    /**
     * String identification of middleware
     */
    public static id: string = 'PathParameterMiddleware';

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

                let pPath: KeyIndex[]|undefined;
                let pTransforms: ParametersTransformsObj|undefined;
        
                if(parameters)
                {
                    pPath = parameters[methodName]?.path;
                    pTransforms = parameters[methodName]?.transforms;
                }
        
                let url: string = request.url;
        
                if (pPath && isPresent(url))
                {
                    for(const data of new ParamsDataIterator(pPath, pTransforms, args, this))
                    {
                        url = await handlePathParam(data, url, args);
                    }
        
                    request = request.clone(
                    {
                        url
                    });
                }
        
                return next(request).subscribe(observer);
            })();
        });
    }
}