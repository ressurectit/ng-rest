import {Type} from '@angular/core';
import {HttpRequest, HttpResponse} from '@angular/common/http';
import {AdditionalInfo} from '@anglr/common';
import {StringDictionary} from '@jscrpt/common';

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