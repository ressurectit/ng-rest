import {Http,
        Headers as AngularHeaders,
        Request,
        RequestOptions,
        RequestMethod as RequestMethods,
        Response,
        URLSearchParams} from "@angular/http";
import {isBlank, isPresent, isFunction, isJsObject, Utils, SERVER_BASE_URL} from '@anglr/common';
import {ResponseType} from './responseType';
import {Cache} from './cache';
import {Observable} from "rxjs/Observable";
import {TransferStateService} from '../transferState/transferState.service';
import * as crypto from 'crypto-js';
import * as param from 'jquery-param';

/**
 * Angular 2 RESTClient class.
 *
 * @class RESTClient
 * @constructor
 */
export abstract class RESTClient
{
    public constructor(protected http: Http,
                       protected baseUrl?: string,
                       protected transferState?: TransferStateService)
    {
        if(isBlank(baseUrl))
        {
            this.baseUrl = "";
        }
    }

    protected getBaseUrl(): string
    {
        return null;
    };

    protected getDefaultHeaders(): Object
    {
        return null;
    };

    /**
     * Request Interceptor
     *
     * @method requestInterceptor
     * @param {Request} req - request object
     */
    protected requestInterceptor(req: Request)
    {
    }

    /**
     * Response Interceptor
     *
     * @method responseInterceptor
     * @param {Response} res - response object
     * @returns {Response} res - transformed response object
     */
    protected responseInterceptor(res: Observable<any> ): Observable<any>
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
            var paramObj: any = {
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
 * Plain body of a REST method, no transformation applied
 * Only one body per method!
 */
export var PlainBody = paramBuilder("PlainBody")("PlainBody");

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
 * Add custom header Content-Type "multipart/form-data" to headers array
 */
export function FormDataContentType()
{
    return function(target: RESTClient, propertyKey: string, descriptor: any)
    {
        descriptor.headers = Utils.common.extend(descriptor.headers || {}, {"content-type": "multipart/form-data"});
        
        return descriptor;
    };
}

/**
 * Defines the response type(s) that the methods can produce
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
        
        if(isPresent(target[methodName]) && isFunction(target[methodName]))
        {
            descriptor.responseTransform = target[methodName];
        }
        
        return descriptor;
    };
}
/**
 * Parameter descriptor that is used for transforming parameter before QueryObject serialization
 * @param  {string} methodName? Name of method that will be called to modify parameter, method takes any type of object and returns transformed object
 */
export function ParameterTransform(methodName?: string)
{
    return function(target: RESTClient, propertyKey: string | symbol, parameterIndex: number)
    {
        if(isBlank(methodName))
        {
            methodName = `${propertyKey}ParameterTransform`;
        }
        
        if(isPresent(target[<string>methodName]) && isFunction(target[<string>methodName]))
        {
            let func = target[<string>methodName];
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
 * @param {RequestOptions} request Request to be hashed
 */
function getRequestHash(baseUrl: string, request: RequestOptions)
{
    let hashRequest = request;

    if(baseUrl.length > 0)
    {
        hashRequest = <any>Utils.common.extend({}, hashRequest);
        let regex = new RegExp(`^${baseUrl}`);

        hashRequest.url = hashRequest.url.replace(regex, "");
    }

    return crypto.SHA256(JSON.stringify(hashRequest)).toString();
}

function methodBuilder(method: number)
{
    return function(url: string)
    {
        return function(target: RESTClient, propertyKey: string, descriptor: any)
        {
            var pPath = target[`${propertyKey}_Path_parameters`];
            var pQuery = target[`${propertyKey}_Query_parameters`];
            var pQueryObject = target[`${propertyKey}_QueryObject_parameters`];
            var pBody = target[`${propertyKey}_Body_parameters`];
            var pPlainBody = target[`${propertyKey}_PlainBody_parameters`];
            var pHeader = target[`${propertyKey}_Header_parameters`];
            var pTransforms = target[`${propertyKey}_ParameterTransforms`];

            descriptor.value = function(...args: any[])
            {
                // Body
                var body = null;
                if (pBody)
                {
                    body = JSON.stringify(args[pBody[0].parameterIndex]);
                }

                if (pPlainBody)
                {
                    body = args[pPlainBody[0].parameterIndex];
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

                // Query
                var search = new URLSearchParams();
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
                            
                            search.set(key, value);
                        });
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
                                                          .replace(/%5B\%5D/g, "")
                                                          .replace(/%5D/g, "")
                                                          .replace(/%5B/g, ".");
                            }
                        });
                        
                    queryString = queryString.replace(/\w+=&/g, "");
                }
                
                // Headers
                // set class default headers
                var headers = new AngularHeaders(this.getDefaultHeaders());
                // set method specific headers
                for (var k in descriptor.headers)
                {
                    if (descriptor.headers.hasOwnProperty(k))
                    {
                        headers.append(k, descriptor.headers[k]);
                    }
                }
                // set parameter specific headers
                if (pHeader)
                {
                    for (var k in pHeader)
                    {
                        if (pHeader.hasOwnProperty(k))
                        {
                            headers.append(pHeader[k].key, args[pHeader[k].parameterIndex]);
                        }
                    }
                }

                // Request options
                var options = new RequestOptions(
                {
                    method,
                    url: this.baseUrl + this.getBaseUrl() + resUrl + (resUrl.indexOf("?") >= 0 || !queryString ? "" : "?") + queryString,
                        headers,
                        body,
                        search
                });

                var req = new Request(options);
                var cached: boolean = false;
                let hashKey : string;
                let fromState = false;
                var observable: Observable<Response>;
                
                //tries to get response from cache
                if(isPresent(descriptor.getCachedResponse))
                {
                    var cachedResponse: Response = descriptor.getCachedResponse(options);
                    
                    if(isPresent(cachedResponse))
                    {
                        cached = true;
                        observable = Observable.of(cachedResponse);
                    }
                }

                // intercept the request
                this.requestInterceptor(req);
                
                if(!cached)
                {
                    //try to retrieve value from transfer state
                    if(isPresent(this.transferState) && !this.transferState.deactivated)
                    {
                        hashKey = getRequestHash(this.baseUrl, options);
                        const data = this.transferState.get(hashKey);

                        if(data)
                        {
                            fromState = true;
                            observable = Observable.of(data);
                        }
                    }

                    //not cached on server side
                    if(!fromState)
                    {
                        // make the request and store the observable for later transformation
                        observable = this.http.request(req);
                    }
                }

                //tries to set response to cache
                if(isPresent(descriptor.saveResponseToCache) && !cached)
                {
                    observable = observable.map(response => descriptor.saveResponseToCache(options, response));
                }

                // transform the obserable in accordance to the @Produces decorator
                if (isPresent(descriptor.responseType) && !fromState)
                {
                    switch(descriptor.responseType)
                    {
                        case ResponseType.Json:
                        {
                            observable = observable.map(res => res.json());
                            
                            break;
                        }
                        case ResponseType.Text:
                        {
                            observable = observable.map(res => <any>res.text());
                            
                            break;
                        }
                        case ResponseType.LocationHeader:
                        {
                            observable = observable.map(res => 
                            {
                                let headerValue = res.headers.get("location");

                                return <any>{
                                    location: headerValue,
                                    id: isPresent(headerValue) ? headerValue.replace(res.url, "") : null
                                };
                            });
                            
                            break;
                        }
                        case ResponseType.LocationHeaderAndJson:
                        {
                            observable = observable.map(res => 
                            {
                                let headerValue = res.headers.get("location");

                                return <any>{
                                    location: headerValue,
                                    id: isPresent(headerValue) ? headerValue.replace(res.url, "") : null,
                                    data: res.json()
                                };
                            });
                            
                            break;
                        }
                    }
                }

                //Store value to state transfer if has not been retrieved from state or state is active
                if(isPresent(this.transferState) && !fromState && !this.transferState.deactivated)
                {
                    hashKey = hashKey || getRequestHash(this.baseUrl, options);

                    observable = observable.do(data =>
                    {
                        this.transferState.set(hashKey, data);
                    });
                }

                // intercept the response
                observable = this.responseInterceptor(observable);
                
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
export var GET = methodBuilder(RequestMethods.Get);

/**
 * POST method
 * @param {string} url - resource url of the method
 */
export var POST = methodBuilder(RequestMethods.Post);

/**
 * PUT method
 * @param {string} url - resource url of the method
 */
export var PUT = methodBuilder(RequestMethods.Put);

/**
 * DELETE method
 * @param {string} url - resource url of the method
 */
export var DELETE = methodBuilder(RequestMethods.Delete);

/**
 * HEAD method
 * @param {string} url - resource url of the method
 */
export var HEAD = methodBuilder(RequestMethods.Head);

export {ResponseType, Cache};