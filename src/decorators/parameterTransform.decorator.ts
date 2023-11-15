import {isBlank, isPresent, isFunction, isString, Dictionary} from '@jscrpt/common';

import {RestParameters} from '../rest/rest.interface';
import type {ParameterTransformFunc, RESTClient} from '../rest/common';

/**
 * Parameter descriptor that is used for transforming parameter before QueryObject serialization
 * @param methodNameOrFuncs - Name of method that will be called to modify parameter, method takes any type of object and returns transformed object, or method directly or array of methods that will be called sequentialy
 */
export function ParameterTransform(methodNameOrFuncs?: string|ParameterTransformFunc|ParameterTransformFunc[])
{
    return function(target: RESTClient & RestParameters, propertyKey: string, parameterIndex: number): void
    {
        if(isBlank(methodNameOrFuncs))
        {
            methodNameOrFuncs = `${propertyKey}ParameterTransform`;
        }

        let paramFunctions: ParameterTransformFunc[] = [];

        if(isString(methodNameOrFuncs))
        {
            const trgt = target as unknown as Dictionary<ParameterTransformFunc>;

            if(isPresent(trgt[methodNameOrFuncs]) && isFunction(trgt[methodNameOrFuncs]))
            {
                paramFunctions = [trgt[methodNameOrFuncs]];
            }
        }
        else if(isFunction(methodNameOrFuncs))
        {
            paramFunctions = [methodNameOrFuncs];
        }
        else if(Array.isArray(methodNameOrFuncs))
        {
            paramFunctions = methodNameOrFuncs.filter(itm => isFunction(itm));
        }

        if(paramFunctions?.length)
        {
            target.parameters = target.parameters ?? {};
            target.parameters[propertyKey] = target.parameters[propertyKey] ?? {};
            const transforms = target.parameters[propertyKey].transforms = target.parameters[propertyKey].transforms ?? {};
            
            transforms[parameterIndex] = function(this: RESTClient, input: any, ...args: any[])
            {
                for(let x = 0; x < paramFunctions.length; x++)
                {
                    input = paramFunctions[x].apply(this, [input, ...args]);
                }

                return input;
            };
        }
    };
}