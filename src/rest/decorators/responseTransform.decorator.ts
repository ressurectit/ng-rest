import {isBlank, isPresent, isFunction} from '@jscrpt/common';

import {RESTClient} from '../common';
import {RestResponseTransform, RestMethodMiddlewares} from '../rest.interface';
import {ResponseTransformMiddleware} from '../middlewares';

/**
 * Defines method name that will be called and modifies response
 * @param methodName - Name of method that will be called to modify response, method takes Observable and returns required type
 */
export function ResponseTransform(methodName?: string)
{
    return function(target: RESTClient, propertyKey: string, descriptor: RestResponseTransform &
                                                                         RestMethodMiddlewares)
    {
        if(isBlank(methodName))
        {
            methodName = `${propertyKey}ResponseTransform`;
        }

        if(isPresent(target[methodName!]) && isFunction(target[methodName!]))
        {
            descriptor.middlewareTypes.push(ResponseTransformMiddleware);
            descriptor.responseTransform = target[methodName!];
        }

        return descriptor;
    };
}