import {isPresent} from '@jscrpt/common';

import {ParametersMetadata, RestParameters, KeyIndex, RestMiddleware, RestMiddlewareType} from '../rest/rest.interface';
import type {RESTClient} from '../rest/common';
import {BodyParameterMiddleware, PathParameterMiddleware, QueryParameterMiddleware, QueryObjectParameterMiddleware, HeaderParameterMiddleware} from '../middlewares';

function paramBuilder(paramName: keyof ParametersMetadata, middleware: RestMiddlewareType<RestMiddleware>)
{
    return function(key: string)
    {
        return function(target: RESTClient & RestParameters, propertyKey: string, parameterIndex: number): void
        {
            const paramObj: KeyIndex =
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
            target.parameters[propertyKey][paramName]?.push(paramObj);

            //sets middleware
            if(isPresent(middleware))
            {
                target.parameters[propertyKey].middlewareTypes = target.parameters[propertyKey].middlewareTypes ?? [];
                target.parameters[propertyKey].middlewareTypes?.push(middleware);
            }
        };
    };
}

/**
 * Path variable of a method's url, type: string
 * @param key - path key to bind value
 */
export const Path = paramBuilder('path', PathParameterMiddleware);

/**
 * Query value of a method's url, type: string
 * @param key - query key to bind value
 */
export const Query = paramBuilder('query', QueryParameterMiddleware);

/**
 * Query object serialized with dot notation separating hierarchies
 */
export const QueryObject = paramBuilder('queryObject', QueryObjectParameterMiddleware)('queryObject');

/**
 * Body of a REST method, json stringify applied
 * Only one body per method!
 */
export const Body = paramBuilder('body', BodyParameterMiddleware)('body');

/**
 * Custom header of a REST method, type: string
 * @param key - header key to bind value
 */
export const Header = paramBuilder('header', HeaderParameterMiddleware);