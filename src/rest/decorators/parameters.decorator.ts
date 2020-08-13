import {isBlank} from '@jscrpt/common';

import {ParametersMetadata, RestParameters, KeyIndex} from '../rest.interface';
import {RESTClient} from '../common';

function paramBuilder(paramName: keyof ParametersMetadata)
{
    return function(key: string)
    {
        return function(target: RESTClient & RestParameters, propertyKey: string, parameterIndex: number)
        {
            let paramObj: KeyIndex =
            {
                key: key,
                parameterIndex: parameterIndex
            };

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
            if(isBlank(target.parameters[propertyKey][paramName]))
            {
                target.parameters[propertyKey][paramName] = [];
            }

            target.parameters[propertyKey][paramName].push(paramObj);
        };
    };
}

/**
 * Path variable of a method's url, type: string
 * @param key - path key to bind value
 */
export var Path = paramBuilder("path");

/**
 * Query value of a method's url, type: string
 * @param key - query key to bind value
 */
export var Query = paramBuilder("query");

/**
 * Query object serialized with dot notation separating hierarchies
 */
export var QueryObject = paramBuilder("queryObject")("queryObject");

/**
 * Body of a REST method, json stringify applied
 * Only one body per method!
 */
export var Body = paramBuilder("body")("body");

/**
 * Custom header of a REST method, type: string
 * @param key - header key to bind value
 */
export var Header = paramBuilder("header");