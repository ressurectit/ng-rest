import {isBlank, isPresent, isFunction, isString, Dictionary} from '@jscrpt/common';

import type {RESTClient, ResponseTransformFunc} from '../common';
import {RestResponseTransform, RestMethodMiddlewares} from '../rest.interface';
import {ResponseTransformMiddleware} from '../middlewares';

/**
 * Defines method name that will be called and modifies response
 * @param methodNameOrFuncs - Name of method that will be called to modify response, method takes Observable and returns required type, or method directly or array of methods that will be called sequentialy
 */
export function ResponseTransform(methodNameOrFuncs?: string|ResponseTransformFunc|ResponseTransformFunc[])
{
    return function<TDecorated>(target: RESTClient, propertyKey: string, descriptor: RestResponseTransform &
                                                                                     RestMethodMiddlewares |
                                                                                     TDecorated): TypedPropertyDescriptor<any>
    {
        const descr = descriptor as RestResponseTransform & RestMethodMiddlewares;

        if(isBlank(methodNameOrFuncs))
        {
            methodNameOrFuncs = `${propertyKey}ResponseTransform`;
        }

        let responseFunctions: ResponseTransformFunc[] = [];

        if(isString(methodNameOrFuncs))
        {
            const trgt = target as unknown as Dictionary<ResponseTransformFunc>;

            if(isPresent(trgt[methodNameOrFuncs]) && isFunction(trgt[methodNameOrFuncs]))
            {
                responseFunctions = [trgt[methodNameOrFuncs]];
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
            descr.middlewareTypes?.push(ResponseTransformMiddleware);
            descr.responseTransform = function(this: RESTClient, observable: any, ...args)
            {
                for(let x = 0; x < responseFunctions.length; x++)
                {
                    observable = responseFunctions[x].apply(this, [observable, ...args]);
                }

                return observable;
            };
        }

        return descr;
    };
}
