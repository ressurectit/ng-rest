import {Type, Injector} from '@angular/core';
import {HttpRequest, HttpResponse} from '@angular/common/http';
import {AdditionalInfo} from '@anglr/common';
import {StringDictionary, Dictionary} from '@jscrpt/common';
import {Observable} from 'rxjs';

import {ResponseType} from './responseType';

/**
 * Property descriptor that is used for creating decorators that can pass additional info to method
 */
export interface AdditionalInfoPropertyDescriptor<TAdditional = any> extends TypedPropertyDescriptor<any>, AdditionalInfo<TAdditional>
{
}

/**
 * Contains additional headers that will be added
 */
export interface RestHttpHeaders extends TypedPropertyDescriptor<any>
{
    /**
     * Headers defintion to be added
     */
    headers?: StringDictionary;
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
    responseTransform?: Function;
}

/**
 * Contains array of interceptor types that will be disabled
 */
export interface RestDisabledInterceptors<TType = any> extends TypedPropertyDescriptor<any>
{
    /**
     * Array of interceptors types that will be disabled
     */
    disabledInterceptors?: Type<TType>[];
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
 * Contains indication whether is response full HttpResponse or just data
 */
export interface RestFullHttpResponse extends TypedPropertyDescriptor<any>
{
    /**
     * Indication whether is response full HttpResponse or just data
     */
    fullHttpResponse?: boolean;
}

/**
 * Contains data that are stored when REST method is set
 */
export interface RestMethod extends TypedPropertyDescriptor<any>
{
    /**
     * Number of parameters that are on the method originaly
     */
    originalParamsCount?: number;
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
    getCachedResponse?: (request: HttpRequest<any>) => HttpResponse<any>|null;

    /**
     * Saves response to cache for provided request and returns this response
     * @param request - Request that is identifies response
     * @param response - Response to be cached
     */
    saveResponseToCache?: (request: HttpRequest<any>, response: HttpResponse<any>) => HttpResponse<any>;
}

/**
 * Information about parameter key and index
 */
export interface KeyIndex
{
    /**
     * Key value that is passed to parameter
     */
    key?: string;

    /**
     * Index of parameter
     */
    parameterIndex?: number;
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
 * Metadata for parameters transforms
 */
export interface ParametersTransformMetadata
{
    transforms?: {[parameterIndex: number]: <TData = any, TRansformedData = TData>(data: TData) => TRansformedData};
}

/**
 * Contains parameters metadata for each decorated method parameters
 */
export interface RestParameters
{
    /**
     * Parameters metadata for each decorated method
     */
    parameters?: Dictionary<ParametersMetadata & ParametersTransformMetadata>;
}

/**
 * Definition of rest middleware that will be pluged in to processing of request and response
 */
export interface RestMiddleware<TRequestBody = any, TResponseBody = any, TDescriptor = any, TTarget = any>
{
    /**
     * Runs code that is defined for this rest middleware, in this method you can modify request and response
     * @param target - Prototype of class that are decorators applied to
     * @param methodName - Name of method that is being modified
     * @param descriptor - Descriptor of method that is being modified
     * @param injector - Angular injector for obtaining dependencies
     * @param request - Http request that you can modify
     * @param next - Used for calling next middleware with modified request
     */
    run(target: TTarget,
        methodName: string,
        descriptor: TDescriptor,
        injector: Injector,
        request: HttpRequest<TRequestBody>,
        next: <TNextRequestBody = any, TNextResponseBody = any>(request: HttpRequest<TNextRequestBody>) => Observable<HttpResponse<TNextResponseBody>>): Observable<HttpResponse<TResponseBody>>;
}