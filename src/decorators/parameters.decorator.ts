import {isPresent} from '@jscrpt/common';

import {BodyParameterMiddleware, PathParameterMiddleware, QueryParameterMiddleware, QueryObjectParameterMiddleware, HeaderParameterMiddleware} from '../middlewares';
import {KeyIndex, ParametersMetadata, RestMiddleware, RestParameters} from '../interfaces';
import {RestMiddlewareType} from '../misc/types';
import type {RESTClientBase} from '../misc/classes/restClientBase';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function paramBuilder(paramName: keyof ParametersMetadata, middleware: RestMiddlewareType<RestMiddleware<any, any, any, any, any>>)
{
    return function(key: string)
    {
        return function(target: RESTClientBase & RestParameters, propertyKey: string, parameterIndex: number): void
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