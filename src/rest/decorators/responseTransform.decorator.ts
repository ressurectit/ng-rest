import {isBlank, isPresent, isFunction, isString} from '@jscrpt/common';

import {RESTClient, ResponseTransformFunc} from '../common';
import {RestResponseTransform, RestMethodMiddlewares} from '../rest.interface';
import {ResponseTransformMiddleware} from '../middlewares';

/**
 * Defines method name that will be called and modifies response
 * @param methodNameOrFuncs - Name of method that will be called to modify response, method takes Observable and returns required type, or method directly or array of methods that will be called sequentialy
 */
export function ResponseTransform(methodNameOrFuncs?: string|ResponseTransformFunc|ResponseTransformFunc[])
{
    return function(target: RESTClient, propertyKey: string, descriptor: RestResponseTransform &
                                                                         RestMethodMiddlewares)
    {
        if(isBlank(methodNameOrFuncs))
        {
            methodNameOrFuncs = `${propertyKey}ResponseTransform`;
        }

        let responseFunctions: ResponseTransformFunc[];

        if(isString(methodNameOrFuncs))
        {
            if(isPresent(target[methodNameOrFuncs]) && isFunction(target[methodNameOrFuncs]))
            {
                responseFunctions = [target[methodNameOrFuncs]];
            }
        }
        else if(isFunction(methodNameOrFuncs))
        {
            responseFunctions = [methodNameOrFuncs];
        }
        else if(Array.isArray(methodNameOrFuncs))
        {
            responseFunctions = methodNameOrFuncs.filter(itm => isFunction(itm));
        }

        if(responseFunctions?.length)
        {
            descriptor.middlewareTypes.push(ResponseTransformMiddleware);
            descriptor.responseTransform = function(this: RESTClient, observable: any, ...args)
            {
                for(let x = 0; x < responseFunctions.length; x++)
                {
                    observable = responseFunctions[x].apply(this, [observable, ...args]);
                }

                return observable;
            };
        }

        return descriptor;
    };
}
