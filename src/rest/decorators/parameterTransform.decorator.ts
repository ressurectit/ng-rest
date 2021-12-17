import {isBlank, isPresent, isFunction, isString} from '@jscrpt/common';

import {RestParameters} from '../rest.interface';
import {ParameterTransformFunc, RESTClient} from '../common';

/**
 * Parameter descriptor that is used for transforming parameter before QueryObject serialization
 * @param methodNameOrFuncs - Name of method that will be called to modify parameter, method takes any type of object and returns transformed object, or method directly or array of methods that will be called sequentialy
 */
export function ParameterTransform(methodNameOrFuncs?: string|ParameterTransformFunc|ParameterTransformFunc[])
{
    return function(target: RESTClient & RestParameters, propertyKey: string, parameterIndex: number)
    {
        if(isBlank(methodNameOrFuncs))
        {
            methodNameOrFuncs = `${propertyKey}ParameterTransform`;
        }

        let paramFunctions: ParameterTransformFunc[];

        if(isString(methodNameOrFuncs))
        {
            if(isPresent(target[methodNameOrFuncs]) && isFunction(target[methodNameOrFuncs]))
            {
                paramFunctions = [target[methodNameOrFuncs]];
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
            //params metadata missing
            if(isBlank(target.parameters))
            {
                target.parameters = {};
            }

            //params metadata for method missing
            if(isBlank(target.parameters[propertyKey]))
            {
                target.parameters[propertyKey] = {};
            }

            //parameter transforms object missing
            if(isBlank(target.parameters[propertyKey].transforms))
            {
                target.parameters[propertyKey].transforms = {};
            }

            target.parameters[propertyKey].transforms[parameterIndex] = function(this: RESTClient, input: any)
            {
                for(let x = 0; x < paramFunctions.length; x++)
                {
                    input = paramFunctions[x].apply(this, [input]);
                }

                return input;
            };
        }
    };
};