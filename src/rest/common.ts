import {Inject, Optional, Injectable, Injector, Type} from '@angular/core';
import {HttpClient, HttpHeaders, HttpRequest} from '@angular/common/http';
import {isBlank, isFunction, generateId} from '@jscrpt/common';
import {SERVER_BASE_URL, SERVER_COOKIE_HEADER, SERVER_AUTH_HEADER, IgnoredInterceptorsService, AdditionalInfo} from '@anglr/common';
import {Observable} from "rxjs";
import {RestTransferStateService} from '../transferState/restTransferState.service';
import {RestHttpHeaders, RestResponseType, RestResponseTransform, RestDisabledInterceptors, RestReportProgress, RestFullHttpResponse, RestMethod, RestCaching, ɵRESTClient, RestParameters, ɵRestMethod, RestMethodMiddlewares, RestMiddleware, BuildMiddlewaresFn} from './rest.interface';
import {buildMiddlewares} from './utils';
import {REST_MIDDLEWARES_ORDER, REST_METHOD_MIDDLEWARES} from './tokens';

/**
 * Angular RESTClient base class.
 */
@Injectable()
export abstract class RESTClient
{
    constructor(protected http: HttpClient,
                @Optional() protected transferState?: RestTransferStateService,
                @Optional() @Inject(SERVER_BASE_URL) protected baseUrl?: string,
                @Optional() @Inject(SERVER_COOKIE_HEADER) protected serverCookieHeader?: string,
                @Optional() @Inject(SERVER_AUTH_HEADER) protected serverAuthHeader?: string,
                @Optional() protected ignoredInterceptorsService?: IgnoredInterceptorsService,
                protected injector?: Injector,
                @Inject(REST_MIDDLEWARES_ORDER) protected middlewaresOrder?: Type<RestMiddleware>[],
                @Inject(REST_METHOD_MIDDLEWARES) protected methodMiddlewares?: Type<RestMiddleware>[])
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
    protected getDefaultHeaders(): string | {[name: string]: string | string[]}
    {
        return {};
    };

    /**
     * Request interceptor for all methods, must return new HttpRequest since object is immutable
     * @param req - request object
     */
    protected requestInterceptor(req: HttpRequest<any>): HttpRequest<any>
    {
        return req;
    }

    /**
     * Allows to intercept all responses for all methods in class
     * @param res - response object
     * @returns res - transformed response object
     */
    protected responseInterceptor(res: Observable<any>): Observable<any>
    {
        return res;
    }
}

// /**
//  * Gets hash of request passed to http
//  * @param baseUrl - Base url that is used with request
//  * @param request - Request to be hashed
//  */
// function getRequestHash(baseUrl: string, request: HttpRequest<any>)
// {
//     let hashRequest = request;

//     if(baseUrl.length > 0)
//     {
//         let regex = new RegExp(`^${baseUrl}`);

//         hashRequest = hashRequest.clone(
//         {
//             url: hashRequest.url.replace(regex, "")
//         });
//     }

//     return sha256(`${hashRequest.method}-${hashRequest.urlWithParams}-${JSON.stringify(request.body)}`).toString();
// }

function methodBuilder(method: string)
{
    return function(url: string)
    {
        return function(target: RESTClient & RestParameters, propertyKey: string, descriptor: RestMethod &
                                                                                              RestFullHttpResponse &
                                                                                              RestReportProgress &
                                                                                              RestDisabledInterceptors &
                                                                                              RestResponseTransform &
                                                                                              RestResponseType &
                                                                                              RestHttpHeaders &
                                                                                              RestCaching &
                                                                                              AdditionalInfo &
                                                                                              ɵRestMethod &
                                                                                              RestMethodMiddlewares)
        {
            if(isFunction(descriptor.value))
            {
                descriptor.originalParamsCount = descriptor.value.length;
            }

            descriptor.middlewareTypes = descriptor.middlewareTypes ?? [];

            let id = `${method}-${url}-${target.constructor.name}-${propertyKey}`;
            // let parameters = target.parameters;

            // let pPath = null;
            // let pQuery = null;
            // let pQueryObject = null;
            // let pBody = null;
            // let pHeader = null;
            // let pTransforms = null;

            // if(parameters)
            // {
            //     pPath = target.parameters[propertyKey]?.path;
            //     pQuery = target.parameters[propertyKey]?.query;
            //     pQueryObject = target.parameters[propertyKey]?.queryObject;
            //     pBody = target.parameters[propertyKey]?.body;
            //     pHeader = target.parameters[propertyKey]?.header;
            //     pTransforms = target.parameters[propertyKey]?.transforms;
            // }

            descriptor.value = function(this: ɵRESTClient, ...args: any[])
            {
                //get middlewares definition only during first call
                if(!descriptor.middlewares)
                {
                    descriptor.middlewares = (buildMiddlewares.bind(this) as BuildMiddlewaresFn)((descriptor.middlewareTypes ?? []).concat(this.methodMiddlewares), this.middlewaresOrder);
                }

                let reqId = `${id}-${generateId(6)}`;
 
                let httpRequest = new HttpRequest<any>(method,
                                                       this.baseUrl + this.getBaseUrl() + url,
                                                       null,
                                                       {
                                                            headers: new HttpHeaders(this.getDefaultHeaders()),
                                                            responseType: 'json',
                                                            reportProgress: false
                                                       });

                //run all middlewares
                let call = (httpReq: HttpRequest<any>, index: number): Observable<any> =>
                {
                    if(!descriptor.middlewares[index])
                    {
                        httpReq = this.requestInterceptor(httpReq);

                        let response = this.http.request(httpReq);

                        response = this.responseInterceptor(response);

                        return response;
                    }
                    else
                    {
                        return descriptor.middlewares[index](reqId,
                                                             target,
                                                             propertyKey,
                                                             descriptor,
                                                             args,
                                                             httpReq,
                                                             request => call(request, ++index));
                    }
                }

                return call(httpRequest, 0);

                // // Body

                // // Path
                // var resUrl: string = url;
                // if (pPath)
                // {
                //     for (var k in pPath)
                //     {
                //         if (pPath.hasOwnProperty(k))
                //         {
                //             resUrl = resUrl.replace("{" + pPath[k].key + "}", args[pPath[k].parameterIndex]);
                //         }
                //     }
                // }

                // // QueryObject
                // var queryString: string = "";
                // if (pQueryObject)
                // {
                //     pQueryObject
                //         .filter(p => args[p.parameterIndex]) // filter out optional parameters
                //         .forEach(p =>
                //         {
                //             var value = args[p.parameterIndex];

                //             if(pTransforms && pTransforms[p.parameterIndex])
                //             {
                //                 value = pTransforms[p.parameterIndex](value);
                //             }

                //             // if the value is a instance of Object, we stringify it
                //             if (value instanceof Object)
                //             {
                //                 queryString += (queryString.length > 0 ? "&" : "") + param(value)
                //                                           .replace(/&&/g, "&")
                //                                           .replace(/%5B%5D/g, "")
                //                                           .replace(/%5D/g, "")
                //                                           .replace(/%5B/g, ".")
                //                                           .replace(/\.(\d+)\./g, "%5B$1%5D.");
                //             }
                //         });

                //     queryString = queryString.replace(/\w+=(&|$)/g, "")
                //                              .replace(/(&|\?)$/g, "");
                // }

                // // Query
                // var params = new HttpParams({fromString: queryString});
                // if (pQuery)
                // {
                //     pQuery
                //         .filter(p => args[p.parameterIndex]) // filter out optional parameters
                //         .forEach(p =>
                //         {
                //             var key = p.key;
                //             var value = args[p.parameterIndex];

                //             // if the value is a instance of Object, we stringify it
                //             if (value instanceof Object)
                //             {
                //                 value = JSON.stringify(value);
                //             }

                //             params = params.append(key, value);
                //         });
                // }

                // // Headers
                // // set class default headers
                // var headers = new HttpHeaders(this.getDefaultHeaders());
                // // set method specific headers
                // for (var k in descriptor.headers)
                // {
                //     if (descriptor.headers.hasOwnProperty(k))
                //     {
                //         headers = headers.append(k, descriptor.headers[k]);
                //     }
                // }
                // // set parameter specific headers
                // if (pHeader)
                // {
                //     for (var k in pHeader)
                //     {
                //         if (pHeader.hasOwnProperty(k))
                //         {
                //             headers = headers.append(pHeader[k].key, args[pHeader[k].parameterIndex]);
                //         }
                //     }
                // }

                // PRODUCES MIDDLEWARE
                // var reportProgress = descriptor.reportProgress || false;
                // var fullHttpResponse = descriptor.fullHttpResponse || false;

                // //append server headers
                // if(isPresent(this.serverCookieHeader))
                // {
                //     headers = headers.append('Cookie', this.serverCookieHeader);
                // }

                // if(isPresent(this.serverAuthHeader))
                // {
                //     headers = headers.append('Authorization', this.serverAuthHeader);
                // }

                // // Request options
                // let req: HttpRequest<any> & AdditionalInfo<IgnoredInterceptorId> = new HttpRequest<any>(method,
                //                                                                                         this.baseUrl + this.getBaseUrl() + resUrl,
                //                                                                                         body,
                //                                                                                         {
                //                                                                                              headers,
                //                                                                                              params,
                //                                                                                              responseType,
                //                                                                                              reportProgress
                //                                                                                         });

                // let cached: boolean = false;
                // let hashKey: string;
                // let fromState = false;

                // //tries to get response from cache
                // if(isPresent(descriptor.getCachedResponse))
                // {
                //     let cachedResponse: HttpResponse<any> = descriptor.getCachedResponse(req);

                //     if (isPresent(cachedResponse))
                //     {
                //         cached = true;
                //         observable = of(cachedResponse);
                //     }
                // }

                // // intercept the request
                // req = this.requestInterceptor(req);

                // if(!cached)
                // {
                //     //try to retrieve value from transfer state
                //     if(isPresent(this.transferState) && !this.transferState.deactivated)
                //     {
                //         hashKey = getRequestHash(this.baseUrl, req);
                //         const data = this.transferState.get(hashKey);

                //         if(data)
                //         {
                //             fromState = true;
                //             observable = of(data);
                //         }
                //     }
                // }

                // //add additionalInfo provided by decorators - ADDITIONAL DATA INTERCEPTOR

                // //disable http client interceptors - IGNORED INTERCEPTORS

                // //not cached on server side
                // if(!fromState && !cached)
                // {
                //     // make the request and store the observable for later transformation
                //     observable = Observable.create((observer: Observer<any>) =>
                //     {
                //         this.http.request(req)
                //     });
                // }

                // //if ignoredInterceptorsService is present clear ignored interceptors
                // if(isPresent(this.ignoredInterceptorsService) && isPresent(descriptor.disabledInterceptors))
                // {
                //     observable = observable!.pipe(map(response =>
                //     {
                //         this.ignoredInterceptorsService.clear();

                //         return response;
                //     }));
                // }

                // //tries to set response to cache
                // if(isPresent(descriptor.saveResponseToCache) && !cached && !fromState && !reportProgress)
                // {
                //     observable = observable!.pipe(map(response => descriptor.saveResponseToCache(req, response)));
                // }

                // // RESPONSETYPEMIDDLEWARE transform the obserable in accordance to the @Produces decorator


                // //Store value to state transfer if has not been retrieved from state or state is active
                // if(isPresent(this.transferState) && !fromState && !this.transferState.deactivated && !reportProgress && !fullHttpResponse)
                // {
                //     hashKey = hashKey! || getRequestHash(this.baseUrl, req);

                //     observable = observable!.pipe(tap((res) =>
                //     {
                //         this.transferState.set(hashKey, res);
                //     }));
                // }

                // // intercept the response
                // observable = this.responseInterceptor(observable!);

                // // transforms response

                // return observable;
            };

            return descriptor;
        };
    };
}

/**
 * GET method
 * @param url - resource url of the method
 */
export var GET = methodBuilder("GET");

/**
 * POST method
 * @param url - resource url of the method
 */
export var POST = methodBuilder("POST");

/**
 * PUT method
 * @param url - resource url of the method
 */
export var PUT = methodBuilder("PUT");

/**
 * DELETE method
 * @param url - resource url of the method
 */
export var DELETE = methodBuilder("DELETE");

/**
 * HEAD method
 * @param url - resource url of the method
 */
export var HEAD = methodBuilder("HEAD");