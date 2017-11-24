import {Inject, Optional, Injectable, Injector} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams, HttpRequest, HttpResponse, HttpEventType} from '@angular/common/http';
import {isBlank, isPresent, isFunction, isJsObject, Utils, SERVER_BASE_URL, SERVER_COOKIE_HEADER, SERVER_AUTH_HEADER} from '@anglr/common';
import {ResponseType} from './responseType';
import {Observable} from "rxjs/Observable";
import {Observer} from "rxjs/Observer";
import {of} from "rxjs/observable/of";
import {map, tap} from "rxjs/operators";
import {TransferStateService} from '../transferState/transferState.service';
import * as crypto from 'crypto-js';
import * as param from 'jquery-param';

/**
 * Angular RESTClient base class.
 *
 * @class RESTClient
 * @constructor
 */
@Injectable()
export abstract class RESTClient
{
    constructor(protected http: HttpClient,
                @Optional() protected transferState?: TransferStateService,
                @Optional() @Inject(SERVER_BASE_URL) protected baseUrl?: string,
                @Optional() @Inject(SERVER_COOKIE_HEADER) protected serverCookieHeader?: string,
                @Optional() @Inject(SERVER_AUTH_HEADER) protected serverAuthHeader?: string,
                @Optional() protected injector?: Injector)
    {
        if(isBlank(baseUrl))
        {
            this.baseUrl = "";
        }
    }

    /**
     * Returns the base url of RESTClient
     */
    protected getBaseUrl(): string
    {
        return "";
    };

    /**
     * Returns the default headers of RESTClient in a key-value 
     */
    protected getDefaultHeaders(): Object
    {
        return {};
    };

    /**
     * Request interceptor for all methods, must return new HttpRequest since object is immutable
     *
     * @method requestInterceptor
     * @param {HttpRequest<any>} req - request object
     */
    protected requestInterceptor(req: HttpRequest<any>): HttpRequest<any>
    {
        return req;
    }

    /**
     * Allows to intercept all responses for all methods in class
     *
     * @method responseInterceptor
     * @param {Observable<any>} res - response object
     * @returns {Observable<any>} res - transformed response object
     */
    protected responseInterceptor(res: Observable<any>): Observable<any>
    {
        return res;
    }
}

/**
 * Set the base URL of REST resource
 * @param {String} url - base URL
 */
export function BaseUrl(url: string)
{
    return function<TFunction extends Function> (Target: TFunction): TFunction
    {
        Target.prototype.getBaseUrl = function()
        {
            return url;
        };
        
        return Target;
    };
}

/**
 * Set default headers for every method of the RESTClient
 * @param {Object} headers - deafult headers in a key-value pair
 */
export function DefaultHeaders(headers: {[key: string]: string})
{
    return function<TFunction extends Function> (Target: TFunction): TFunction
    {
        Target.prototype.getDefaultHeaders = function()
        {
            return headers;
        };
        
        return Target;
    };
}

function paramBuilder(paramName: string)
{
    return function(key: string)
    {
        return function(target: RESTClient, propertyKey: string | symbol, parameterIndex: number)
        {
            var metadataKey = `${propertyKey}_${paramName}_parameters`;

            var paramObj: any = 
            {
                key: key,
                parameterIndex: parameterIndex
            };

            if (Array.isArray(target[metadataKey]))
            {
                target[metadataKey].push(paramObj);
            }
            else
            {
                target[metadataKey] = [paramObj];
            }
        };
    };
}

/**
 * Path variable of a method's url, type: string
 * @param {string} key - path key to bind value
 */
export var Path = paramBuilder("Path");

/**
 * Query value of a method's url, type: string
 * @param {string} key - query key to bind value
 */
export var Query = paramBuilder("Query");

/**
 * Query object serialized with dot notation separating hierarchies
 */
export var QueryObject = paramBuilder("QueryObject")("QueryObject");

/**
 * Body of a REST method, json stringify applied
 * Only one body per method!
 */
export var Body = paramBuilder("Body")("Body");

/**
 * Custom header of a REST method, type: string
 * @param {string} key - header key to bind value
 */
export var Header = paramBuilder("Header");

/**
 * Set custom headers for a REST method
 * @param {Object} headersDef - custom headers in a key-value pair
 */
export function Headers(headersDef: {[key: string]: string})
{
    return function(target: RESTClient, propertyKey: string, descriptor: any)
    {
        descriptor.headers = Utils.common.extend({}, headersDef, descriptor.headers);

        return descriptor;
    };
}

/**
 * Add custom header Content-Type "application/json" to headers array
 */
export function JsonContentType()
{
    return function(target: RESTClient, propertyKey: string, descriptor: any)
    {
        descriptor.headers = Utils.common.extend(descriptor.headers || {}, {"content-type": "application/json"});
        
        return descriptor;
    };
}

/**
 * Defines the response type(s) that the methods can produce or tzpe of body id full request or events are requested
 * @param {ResponseType} producesDef - response type to be produced
 */
export function Produces(producesDef: ResponseType)
{
    return function(target: RESTClient, propertyKey: string, descriptor: any)
    {
        descriptor.responseType = producesDef;
        return descriptor;
    };
}

/**
 * Defines method name that will be called and modifies response
 * @param  {string} methodName Name of method that will be called to modify response, method takes Observable and returns required type
 */
export function ResponseTransform(methodName?: string)
{
    return function(target: any, propertyKey: string, descriptor: any)
    {
        if(isBlank(methodName))
        {
            methodName = `${propertyKey}ResponseTransform`;
        }
        
        if(isPresent(target[methodName!]) && isFunction(target[methodName!]))
        {
            descriptor.responseTransform = target[methodName!].bind(target);
        }
        
        return descriptor;
    };
}

/**
 * Allows method to report full progress events
 */
export function ReportProgress()
{
    return function(target: any, propertyKey: string, descriptor: any)
    {
        descriptor.reportProgress = true;
        
        return descriptor;
    };
}

/**
 * Allows method to return full HttpResponse with requested response type body
 */
export function FullHttpResponse()
{
    return function(target: any, propertyKey: string, descriptor: any)
    {
        descriptor.fullHttpResponse = true;
        
        return descriptor;
    };
}

/**
 * Parameter descriptor that is used for transforming parameter before QueryObject serialization
 * @param {string} methodName? Name of method that will be called to modify parameter, method takes any type of object and returns transformed object
 */
export function ParameterTransform(methodName?: string)
{
    return function(target: RESTClient, propertyKey: string | symbol, parameterIndex: number)
    {
        if(isBlank(methodName))
        {
            methodName = `${propertyKey}ParameterTransform`;
        }
        
        if(isPresent(target[methodName!]) && isFunction(target[methodName!]))
        {
            let func = target[methodName!];
            let metadataKey = `${propertyKey}_ParameterTransforms`;
            
            if (!isPresent(target[metadataKey]) || !isJsObject(target[metadataKey]))
            {
                target[metadataKey] = {};
            }
            
            target[metadataKey][parameterIndex] = func;
        }
    };
};

/**
 * Gets hash of request passed to http
 * @param {string} baseUrl Base url that is used with request
 * @param {HttpRequest<any>} request Request to be hashed
 */
function getRequestHash(baseUrl: string, request: HttpRequest<any>)
{
    let hashRequest = request;

    if(baseUrl.length > 0)
    {
        let regex = new RegExp(`^${baseUrl}`);

        hashRequest = hashRequest.clone(
        {
            url: hashRequest.url.replace(regex, "")
        });
    }

    return crypto.SHA256(`${hashRequest.method}-${hashRequest.urlWithParams}-${JSON.stringify(request.headers)}-${JSON.stringify(request.body)}`).toString();
}

function methodBuilder(method: string)
{
    return function(url: string)
    {
        return function(target: RESTClient, propertyKey: string, descriptor: any)
        {
            if(isFunction(descriptor.value))
            {
                descriptor.originalParamsCount = descriptor.value.length;
            }

            var pPath = target[`${propertyKey}_Path_parameters`];
            var pQuery = target[`${propertyKey}_Query_parameters`];
            var pQueryObject = target[`${propertyKey}_QueryObject_parameters`];
            var pBody = target[`${propertyKey}_Body_parameters`];
            var pHeader = target[`${propertyKey}_Header_parameters`];
            var pTransforms = target[`${propertyKey}_ParameterTransforms`];

            descriptor.value = function(...args: any[])
            {
                // Body
                var body = null;
                if (pBody)
                {
                    body = args[pBody[0].parameterIndex];
                }

                // Path
                var resUrl: string = url;
                if (pPath)
                {
                    for (var k in pPath)
                    {
                        if (pPath.hasOwnProperty(k))
                        {
                            resUrl = resUrl.replace("{" + pPath[k].key + "}", args[pPath[k].parameterIndex]);
                        }
                    }
                }

                // QueryObject
                var queryString: string = "";
                if (pQueryObject)
                {
                    pQueryObject
                        .filter(p => args[p.parameterIndex]) // filter out optional parameters
                        .forEach(p =>
                        {
                            var value = args[p.parameterIndex];
                            
                            if(pTransforms && pTransforms[p.parameterIndex])
                            {
                                value = pTransforms[p.parameterIndex](value);
                            }
                            
                            // if the value is a instance of Object, we stringify it
                            if (value instanceof Object)
                            {
                                queryString += (queryString.length > 0 ? "&" : "") + param(value)
                                                          .replace(/&&/g, "&")
                                                          .replace(/%5B\%5D/g, "")
                                                          .replace(/%5D/g, "")
                                                          .replace(/%5B/g, ".");
                            }
                        });
                        
                    queryString = queryString.replace(/\w+=&/g, "");
                }

                // Query
                var params = new HttpParams({fromString: queryString});
                if (pQuery)
                {
                    pQuery
                        .filter(p => args[p.parameterIndex]) // filter out optional parameters
                        .forEach(p =>
                        {
                            var key = p.key;
                            var value = args[p.parameterIndex];
                            
                            // if the value is a instance of Object, we stringify it
                            if (value instanceof Object)
                            {
                                value = JSON.stringify(value);
                            }
                            
                            params = params.append(key, value);
                        });
                }
                
                // Headers
                // set class default headers
                var headers = new HttpHeaders(this.getDefaultHeaders());
                // set method specific headers
                for (var k in descriptor.headers)
                {
                    if (descriptor.headers.hasOwnProperty(k))
                    {
                        headers = headers.append(k, descriptor.headers[k]);
                    }
                }
                // set parameter specific headers
                if (pHeader)
                {
                    for (var k in pHeader)
                    {
                        if (pHeader.hasOwnProperty(k))
                        {
                            headers = headers.append(pHeader[k].key, args[pHeader[k].parameterIndex]);
                        }
                    }
                }

                if(isBlank(descriptor.responseType))
                {
                    descriptor.responseType = ResponseType.Json;
                }
                
                let responseType: 'arraybuffer' | 'blob' | 'json' | 'text' = 'json';

                switch(descriptor.responseType)
                {
                    case ResponseType.Json:
                    case ResponseType.LocationHeaderAndJson:
                    {
                        responseType = 'json';

                        break;
                    }
                    case ResponseType.LocationHeader:
                    case ResponseType.Text:
                    {
                        responseType = 'text';
                        
                        break;
                    }
                    case ResponseType.Blob:
                    {
                        responseType = 'blob';
                        
                        break;
                    }
                    case ResponseType.ArrayBuffer:
                    {
                        responseType = 'arraybuffer';
                        
                        break;
                    }
                }

                var reportProgress = descriptor.reportProgress || false;
                var fullHttpResponse = descriptor.fullHttpResponse || false;

                //append server headers
                if(isPresent(this.serverCookieHeader))
                {
                    headers = headers.append('Cookie', this.serverCookieHeader);
                }

                if(isPresent(this.serverAuthHeader))
                {
                    headers = headers.append('Authorization', this.serverAuthHeader);
                }

                // Request options
                let req = new HttpRequest<any>(method,
                                               this.baseUrl + this.getBaseUrl() + resUrl,
                                               body,
                                               {
                                                    headers,
                                                    params,
                                                    responseType,
                                                    reportProgress
                                               });

                let cached: boolean = false;
                let hashKey: string;
                let fromState = false;
                let observable: Observable<any>;
                
                //tries to get response from cache
                if(isPresent(descriptor.getCachedResponse))
                {
                    let cachedResponse: HttpResponse<any> = descriptor.getCachedResponse(req);
                    
                    if (isPresent(cachedResponse))
                    {
                        cached = true;
                        observable = of(cachedResponse);
                    }
                }

                // intercept the request
                req = this.requestInterceptor(req);
                
                if(!cached)
                {
                    //try to retrieve value from transfer state
                    if(isPresent(this.transferState) && !this.transferState.deactivated)
                    {
                        hashKey = getRequestHash(this.baseUrl, req);
                        const data = this.transferState.get(hashKey);

                        if(data)
                        {
                            fromState = true;
                            observable = of(data);
                        }
                    }
                }

                //not cached on server side
                if(!fromState && !cached)
                {
                    // make the request and store the observable for later transformation
                    observable = Observable.create((observer: Observer<any>) =>
                    {
                        this.http.request(req)
                            .subscribe(result =>
                            {
                                if(reportProgress)
                                {
                                    observer.next(result);
                                }

                                if(result.type == HttpEventType.Response)
                                {
                                    observer.next(result);
                                    observer.complete();
                                }
                            }, error => observer.error(error));
                    });
                }

                //tries to set response to cache
                if(isPresent(descriptor.saveResponseToCache) && !cached && !fromState && !reportProgress)
                {
                    observable = observable!.pipe(map(response => descriptor.saveResponseToCache(req, response)));
                }

                // transform the obserable in accordance to the @Produces decorator
                if (isPresent(descriptor.responseType) && !fromState && !reportProgress && !fullHttpResponse)
                {
                    switch(descriptor.responseType)
                    {
                        default:
                        case ResponseType.Text:
                        case ResponseType.Json:
                        case ResponseType.Blob:
                        case ResponseType.ArrayBuffer:
                        {
                            observable = observable!.pipe(map((res: HttpResponse<any>) => res.body));

                            break;
                        }
                        case ResponseType.LocationHeader:
                        {
                            observable = observable!.pipe(map((res: HttpResponse<any>) => 
                            {
                                let headerValue = res.headers.get("location");
                                let baseUrl = res.url!.replace(/^http(?:s)?:\/\/.*?\//, '/');
                                let url = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';

                                return <any>{
                                    location: headerValue,
                                    id: isPresent(headerValue) ? headerValue!.replace(url, "") : null
                                };
                            }));
                            
                            break;
                        }
                        case ResponseType.LocationHeaderAndJson:
                        {
                            observable = observable!.pipe(map((res: HttpResponse<any>) => 
                            {
                                let headerValue = res.headers.get("location");
                                let baseUrl = res.url!.replace(/^http(?:s)?:\/\/.*?\//, '/');
                                let url = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';

                                return <any>{
                                    location: headerValue,
                                    id: isPresent(headerValue) ? headerValue!.replace(url, "") : null,
                                    data: res.body
                                };
                            }));
                            
                            break;
                        }
                    }
                }

                //Store value to state transfer if has not been retrieved from state or state is active
                if(isPresent(this.transferState) && !fromState && !this.transferState.deactivated && !reportProgress && !fullHttpResponse)
                {
                    hashKey = hashKey! || getRequestHash(this.baseUrl, req);

                    observable = observable!.pipe(tap((res) =>
                    {
                        this.transferState.set(hashKey, res);
                    }));
                }

                // intercept the response
                observable = this.responseInterceptor(observable!);
                
                // transforms response
                if(isPresent(descriptor.responseTransform))
                {
                    observable = descriptor.responseTransform(observable);
                }

                return observable;
            };

            return descriptor;
        };
    };
}

/**
 * GET method
 * @param {string} url - resource url of the method
 */
export var GET = methodBuilder("GET");

/**
 * POST method
 * @param {string} url - resource url of the method
 */
export var POST = methodBuilder("POST");

/**
 * PUT method
 * @param {string} url - resource url of the method
 */
export var PUT = methodBuilder("PUT");

/**
 * DELETE method
 * @param {string} url - resource url of the method
 */
export var DELETE = methodBuilder("DELETE");

/**
 * HEAD method
 * @param {string} url - resource url of the method
 */
export var HEAD = methodBuilder("HEAD");