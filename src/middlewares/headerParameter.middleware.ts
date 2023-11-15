import {HttpRequest} from '@angular/common/http';
import {StringDictionary} from '@jscrpt/common';
import {Observable} from 'rxjs';

import {ParamsDataIterator} from '../misc/classes/paramsData.iterator';
import {handleHeaderParam} from '../misc/utils';
import {KeyIndex, ParametersTransformsObj, RestMiddleware, RestParameters} from '../interfaces';
import type {RESTClientBase} from '../misc/classes/restClientBase';

/**
 * Middleware that is used for adding header from parameter
 */
export class HeaderParameterMiddleware implements RestMiddleware<unknown, unknown, unknown, RestParameters>
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
        
                    for(const data of new ParamsDataIterator(pHeader, pTransforms, args, this))
                    {
                        await handleHeaderParam(data, headers, args);
                    }
        
                    request = request.clone(
                    {
                        setHeaders: headers
                    });
                }
        
                return next(request).subscribe(observer);
            })();
        });
    }
}