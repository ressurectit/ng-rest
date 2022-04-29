import {Type} from '@angular/core';
import {HttpRequest, HttpResponse} from '@angular/common/http';
import {StringDictionary, Dictionary} from '@jscrpt/common';
import {Observable} from 'rxjs';

import {ResponseType} from './responseType';
import type {ParameterTransformFunc, ResponseTransformFunc, RESTClient} from '../rest/common';

/**
 * Type indicates that it should be removed from array
 */
export class NotType<TType>
{
    //######################### constructor #########################
    constructor(public ɵtype: Type<TType>)
    {
    }
}

/**
 * Contains additional headers that will be added
 */
export interface RestHttpHeaders extends TypedPropertyDescriptor<any>
{
    /**
     * Headers defintion to be added
     */
    headers: StringDictionary;
}

/**
 * Contains name of progress indicator group for local progress indicator
 */
export interface RestProgressIndicatorGroup extends TypedPropertyDescriptor<any>
{
    /**
     * Name of progress indicator group
     */
    groupName: string;
}

/**
 * Contains response type that will be set
 */
export interface RestResponseType extends TypedPropertyDescriptor<any>
{
    /**
     * Response type to be set
     */
    responseType?: ResponseType;
}

/**
 * Contains response transform function to be called
 */
export interface RestResponseTransform extends TypedPropertyDescriptor<any>
{
    /**
     * Response transform function
     */
    responseTransform: ResponseTransformFunc;
}

/**
 * Contains array of interceptor types that will be disabled
 */
export interface RestDisabledInterceptors<TType = any> extends TypedPropertyDescriptor<any>
{
    /**
     * Array of interceptors types that will be disabled
     */
    disabledInterceptors: Type<TType>[];
}

/**
 * Contains indication whether report progress
 */
export interface RestReportProgress extends TypedPropertyDescriptor<any>
{
    /**
     * Indication whether report progress
     */
    reportProgress?: boolean;
}

/**
 * Contains data that are stored when REST method is set
 */
export interface ɵRestMethod extends TypedPropertyDescriptor<any>
{
    /**
     * Array of middlewares that are executed for each request
     */
    middlewares: RestMiddlewareRunMethod[];
}

/**
 * Contains data that are stored when REST method is set
 */
export interface RestMethod extends TypedPropertyDescriptor<any>
{
    /**
     * Number of parameters that are on the method originaly
     */
    originalParamsCount: number;
}

/**
 * Contains rest middleware types that will be used, decorator can add type if it wish to be used
 */
export interface RestMethodMiddlewares extends TypedPropertyDescriptor<any>
{
    /**
     * Array of rest middleware types that will be used
     */
    middlewareTypes?: Type<RestMiddleware>[];
}

/**
 * Contains methods used for handling 'caching'
 */
export interface RestCaching extends TypedPropertyDescriptor<any>
{
    /**
     * Gets response from cache
     * @param request - Http request that is tested whether it is in cache
     */
    getCachedResponse: (request: HttpRequest<any>) => HttpResponse<any>|null;

    /**
     * Saves response to cache for provided request and returns this response
     * @param request - Request that is identifies response
     * @param response - Response to be cached
     */
    saveResponseToCache: (request: HttpRequest<any>, response: HttpResponse<any>) => HttpResponse<any>;
}

/**
 * Contains data that are used for clearing advanced cache service
 */
export interface RestClearAdvancedCaching extends TypedPropertyDescriptor<any>
{
    /**
     * Key to stored cache item
     */
    key: string;
}

/**
 * Contains data that are used for advanced cache service
 */
export interface RestAdvancedCaching extends RestClearAdvancedCaching
{
    /**
     * Relative definition of 'date' for setting validity of cache, example +2d, +12h
     */
    validUntil?: string;
}

/**
 * Information about parameter key and index
 */
export interface KeyIndex
{
    /**
     * Key value that is passed to parameter
     */
    key: string;

    /**
     * Index of parameter
     */
    parameterIndex: number;
}

/**
 * Metadata for parameters
 */
export interface ParametersMetadata
{
    path?: KeyIndex[];
    query?: KeyIndex[];
    queryObject?: KeyIndex[];
    body?: KeyIndex[];
    header?: KeyIndex[];
}

/**
 * Defines object for parameter transforms
 */
export interface ParametersTransformsObj
{
    [parameterIndex: number]: ParameterTransformFunc;
}

/**
 * Metadata for parameters transforms
 */
export interface ParametersTransformMetadata
{
    transforms?: ParametersTransformsObj;
}

/**
 * Metadata for middleware types for parameters
 */
export interface ParametersMiddlewaresMetadata
{
    /**
     * Array of rest middleware types that will be used
     */
    middlewareTypes?: Type<RestMiddleware>[];
}

/**
 * Contains parameters metadata for each decorated method parameters
 */
export interface RestParameters
{
    /**
     * Parameters metadata for each decorated method
     */
    parameters?: Dictionary<ParametersMetadata & ParametersTransformMetadata & ParametersMiddlewaresMetadata>;
}

/**
 * Definition of method that is used for running middleware code
 */
export interface RestMiddlewareRunMethod<TRequestBody = any, TResponseBody = any, TDescriptor = any, TTarget = any>
{
    /**
     * Runs code that is defined for this rest middleware, in this method you can modify request and response
     * @param this - Method is bound to RESTClient
     * @param id - Unique id that identifies request method
     * @param target - Prototype of class that are decorators applied to
     * @param methodName - Name of method that is being modified
     * @param descriptor - Descriptor of method that is being modified
     * @param args - Array of arguments passed to called method
     * @param request - Http request that you can modify
     * @param next - Used for calling next middleware with modified request
     */
    (this: RESTClient,
     id: string,
     target: TTarget,
     methodName: string,
     descriptor: TDescriptor,
     args: any[],
     request: HttpRequest<TRequestBody>,
     next: <TNextRequestBody = any, TNextResponseBody = any>(request: HttpRequest<TNextRequestBody>) => Observable<TNextResponseBody>): Observable<TResponseBody>;
}

/**
 * Definition of rest middleware that will be pluged in to processing of request and response
 */
export interface RestMiddleware<TRequestBody = any, TResponseBody = any, TDescriptor = any, TTarget = any>
{
    /**
     * Runs code that is defined for this rest middleware, in this method you can modify request and response
     * @param id - Unique id that identifies request method
     * @param target - Prototype of class that are decorators applied to
     * @param methodName - Name of method that is being modified
     * @param descriptor - Descriptor of method that is being modified
     * @param request - Http request that you can modify
     * @param next - Used for calling next middleware with modified request
     */
    run: RestMiddlewareRunMethod<TRequestBody, TResponseBody, TDescriptor, TTarget>;
}

/**
 * Defintion of buildMiddleware function type
 */
export interface BuildMiddlewaresFn
{
    /**
     * Builds and returns array of middleware run functions
     * @param this - Instance of RESTClient
     * @param middlewares - Array of set middleware types
     * @param middlewaresOrder - Array of middleware types in order that should be executed
     */
    (middlewares: Type<RestMiddleware>[], middlewaresOrder: Type<RestMiddleware>[]): RestMiddlewareRunMethod[]
}

/**
 * Definition of RestDateApi used for testing whether value is date and for serialization
 */
export interface RestDateApi<TDate = any>
{
    /**
     * Tests whether provided value is date
     * @param value - Value to be tested
     */
    isDate(value: any): value is TDate|Date;

    /**
     * Serialize date into string representation of date
     * @param value - Value to be serialized
     */
    toString(value: TDate|Date): string;

    /**
     * Tests whether tested date is before now
     * @param tested - Tested date
     */
    isBeforeNow(tested: TDate): boolean;
}