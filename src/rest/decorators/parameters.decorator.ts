import {Type} from '@angular/core';
import {isPresent} from '@jscrpt/common';

import {ParametersMetadata, RestParameters, KeyIndex, RestMiddleware} from '../rest.interface';
import {RESTClient} from '../common';
import {BodyParameterMiddleware, PathParameterMiddleware, QueryParameterMiddleware, QueryObjectParameterMiddleware, HeaderParameterMiddleware} from '../middlewares';

function paramBuilder(paramName: keyof ParametersMetadata, middleware: Type<RestMiddleware>)
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
            target.parameters = target.parameters ?? {};

            //params metadata for method missing
            target.parameters[propertyKey] = target.parameters[propertyKey] ?? {};

            //parameter transforms object missing
            target.parameters[propertyKey][paramName] = target.parameters[propertyKey][paramName] ?? [];

            //adds params
            target.parameters[propertyKey][paramName].push(paramObj);

            //sets middleware
            if(isPresent(middleware))
            {
                target.parameters[propertyKey].middlewareTypes = target.parameters[propertyKey].middlewareTypes ?? [];
                target.parameters[propertyKey].middlewareTypes.push(middleware);
            }
        };
    };
}

/**
 * Path variable of a method's url, type: string
 * @param key - path key to bind value
 */
export var Path = paramBuilder("path", PathParameterMiddleware);

/**
 * Query value of a method's url, type: string
 * @param key - query key to bind value
 */
export var Query = paramBuilder("query", QueryParameterMiddleware);

/**
 * Query object serialized with dot notation separating hierarchies
 */
export var QueryObject = paramBuilder("queryObject", QueryObjectParameterMiddleware)("queryObject");

/**
 * Body of a REST method, json stringify applied
 * Only one body per method!
 */
export var Body = paramBuilder("body", BodyParameterMiddleware)("body");

/**
 * Custom header of a REST method, type: string
 * @param key - header key to bind value
 */
export var Header = paramBuilder("header", HeaderParameterMiddleware);