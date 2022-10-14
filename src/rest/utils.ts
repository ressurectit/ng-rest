import {HttpParams} from '@angular/common/http';
import {isPresent, StringDictionary} from '@jscrpt/common';

import {ParameterTransformFunc, RESTClient} from './common';
import {ParamsDataIteratorItem} from './paramsData.iterator';
import {QueryStringSerializer} from './queryStringSerializer';
import {RestMiddleware, RestMiddlewareRunMethod, NotType, BuildMiddlewaresFn, RestMiddlewareType, RestMiddlewareOrderType} from './rest.interface';

type RestClientWithTransform = RESTClient&{transformFn: ParameterTransformFunc};

/**
 * Builds and returns array of middleware run functions
 * @param middlewares - Array of set middleware types
 * @param middlewaresOrder - Array of middleware types in order that should be executed
 */
export const buildMiddlewares: BuildMiddlewaresFn = function buildMiddlewares(middlewares: RestMiddlewareType<RestMiddleware>[],
                                                                              middlewaresOrder: RestMiddlewareOrderType<string>[]): RestMiddlewareRunMethod[]
{
    const usedMiddlewares: RestMiddlewareType<RestMiddleware>[] = [];

    middlewares
        .filter(middleware => !isNotType(middleware))
        .forEach(middleware =>
        {
            const type: RestMiddlewareType<RestMiddleware> = getType(middleware);
            const index = middlewaresOrder.findIndex(itm => itm == type || type.id == itm);

            //middleware does not have defined order
            if(index < 0)
            {
                return;
            }

            usedMiddlewares[index] = type;
        });

    //removes not middlewares
    middlewares
        .filter(middleware => isNotType(middleware))
        .forEach(middleware =>
        {
            const type: RestMiddlewareType<RestMiddleware> = getType(middleware);
            const index = middlewaresOrder.findIndex(itm => itm == type || type.id == itm);

            if(index < 0)
            {
                return;
            }

            usedMiddlewares.splice(index, 1);
        });

    const runMethods: RestMiddlewareRunMethod[] = [];

    usedMiddlewares.forEach(middleware =>
    {
        runMethods.push(new middleware().run);
    });

    return runMethods;
};

/**
 * Creates NotType from Type, this type will be removed from middlewares
 * @param type - Type that will be set as NotType
 */
export function not(type: RestMiddlewareType<RestMiddleware>): RestMiddlewareType<RestMiddleware>
{
    return new NotType<RestMiddleware>(type) as unknown as RestMiddlewareType<RestMiddleware>;
}

/**
 * Gets underlying type for Type and NotType
 * @param type - Type that is going to be used for extraction
 */
export function getType<TType extends RestMiddleware>(type: RestMiddlewareType<TType>): RestMiddlewareType<TType>
{
    if(type instanceof NotType)
    {
        return type.ɵtype;
    }

    return type;
}

/**
 * Tests whether is provided type NotType
 * @param type - Type to be tested for NotType
 */
export function isNotType<TType extends RestMiddleware>(type: RestMiddlewareType<TType>): boolean
{
    return type instanceof NotType;
}

/**
 * Handles query param and fills params dictionary
 * @param data - Data for creating query param
 * @param params - Params where should be new value placed
 */
export function handleQueryParam(data: ParamsDataIteratorItem, params: StringDictionary): void
{
    //apply parameter transform
    if(data.transformFn)
    {
        data.value = (data as any as RestClientWithTransform).transformFn(data.value);
    }

    // if the value is a instance of Object, we stringify it
    if (data.value instanceof Object)
    {
        data.value = JSON.stringify(data.value);
    }

    //only non null and non undefined values
    if(isPresent(data.value))
    {
        params[data.key] = data.value;
    }
}

/**
 * Handles header param and fills headers dictionary
 * @param data - Data for creating header param
 * @param headers - Params where should be new value placed
 */
export function handleHeaderParam(data: ParamsDataIteratorItem, headers: StringDictionary): void
{
    //apply parameter transform
    if(data.transformFn)
    {
        data.value = (data as any as RestClientWithTransform).transformFn(data.value);
    }

    //only non null and non undefined values
    if(isPresent(data.value))
    {
        headers[data.key] = data.value;
    }
}

/**
 * Handles path param and return updated url
 * @param data - Data for creating path param
 * @param url - Current url to be updated
 */
export function handlePathParam(data: ParamsDataIteratorItem, url: string): string
{
    //apply parameter transform
    if(data.transformFn)
    {
        data.value = (data as any as RestClientWithTransform).transformFn(data.value);
    }

    return url.replace('{' + data.key + '}', data.value ?? '');
}

/**
 * Handles query object param and fills serialized query string array
 * @param data - Data for creating query object param
 * @param queryStrings - Array of query serialized query strings
 * @param querySerializer - Serializer for query object
 */
export function handleQueryObjectParam(data: ParamsDataIteratorItem, queryStrings: string[], querySerializer: QueryStringSerializer): void
{
    //apply parameter transform
    if(data.transformFn)
    {
        data.value = (data as any as RestClientWithTransform).transformFn(data.value);
    }

    const serializedObj = querySerializer.serializeObject(data.value);

    if(serializedObj)
    {
        queryStrings.push(serializedObj);
    }
}

/**
 * Merges serialized query objects data with existing http params
 * @param queryStrings - Serialized query objects data
 * @param requestParams - Existing http params to be merged with
 */
export function mergeQueryObjectParamsWithHttpParams(queryStrings: string[], requestParams: HttpParams): HttpParams
{
    const queryString = queryStrings.join('&');
    const params: HttpParams = new HttpParams({fromString: queryString});

    params.keys().forEach(key =>
    {
        const newValues = params.getAll(key);

        if(newValues)
        {
            newValues.forEach((value, index) =>
            {
                //first item, set
                if(!index)
                {
                    requestParams = requestParams.set(key, value);
                }
                //rest append
                else
                {
                    requestParams = requestParams.append(key, value);
                }
            });
        }
    });

    return requestParams;
}