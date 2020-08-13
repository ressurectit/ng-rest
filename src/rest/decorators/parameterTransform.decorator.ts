import {isBlank, isPresent, isFunction} from '@jscrpt/common';

import {RestParameters} from '../rest.interface';
import {RESTClient} from '../common';

/**
 * Parameter descriptor that is used for transforming parameter before QueryObject serialization
 * @param methodName - Name of method that will be called to modify parameter, method takes any type of object and returns transformed object
 */
export function ParameterTransform(methodName?: string)
{
    return function(target: RESTClient & RestParameters, propertyKey: string, parameterIndex: number)
    {
        if(isBlank(methodName))
        {
            methodName = `${propertyKey}ParameterTransform`;
        }

        //method exists
        if(isPresent(target[methodName]) && isFunction(target[methodName!]))
        {
            let func = target[methodName!];

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

            target.parameters[propertyKey].transforms[parameterIndex] = func;
        }
    };
};