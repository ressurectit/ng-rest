import {Inject, Optional, Injectable, Injector, Type} from '@angular/core';
import {HttpClient, HttpHeaders, HttpRequest, HttpEvent} from '@angular/common/http';
import {HTTP_REQUEST_BASE_URL} from '@anglr/common';
import {isBlank, isFunction, generateId} from '@jscrpt/common';
import {Observable} from 'rxjs';

import {RestMethod, RestParameters, ɵRestMethod, RestMethodMiddlewares, RestMiddleware} from './rest.interface';
import {buildMiddlewares} from './utils';
import {REST_MIDDLEWARES_ORDER, REST_METHOD_MIDDLEWARES} from './tokens';

//TODO
// @Optional() protected transferState?: RestTransferStateService,
// @Optional() @Inject(SERVER_COOKIE_HEADER) protected serverCookieHeader?: string,
// @Optional() @Inject(SERVER_AUTH_HEADER) protected serverAuthHeader?: string,

/**
 * Function that is used as response transform function
 */
export interface ResponseTransformFunc<TResponse = any, TTransformedResponse = TResponse>
{
    (this: RESTClient, response: Observable<TResponse>, ...args: any[]): Observable<TTransformedResponse>;
}

/**
 * Function that is used as parameter transform function
 */
export interface ParameterTransformFunc<TData = any, TTransformedData = TData>
{
    (this: RESTClient, data: TData): TTransformedData;
}

/**
 * Angular RESTClient base class.
 */
@Injectable()
export abstract class RESTClient
{
    constructor(protected http: HttpClient,
                protected injector: Injector,
                @Inject(REST_MIDDLEWARES_ORDER) protected middlewaresOrder: Type<RestMiddleware>[],
                @Inject(REST_METHOD_MIDDLEWARES) protected methodMiddlewares: Type<RestMiddleware>[],
                @Optional() @Inject(HTTP_REQUEST_BASE_URL) protected baseUrl?: string)
    {
        if(isBlank(baseUrl))
        {
            this.baseUrl = '';
        }
    }

    /**
     * Returns the base url of RESTClient
     */
    protected getBaseUrl(): string
    {
        return '';
    }

    /**
     * Returns the default headers of RESTClient in a key-value
     */
    protected getDefaultHeaders(): string | {[name: string]: string | string[]}
    {
        return {};
    }

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
    protected responseInterceptor<TBody = any>(res: Observable<HttpEvent<TBody>>): Observable<HttpEvent<any>>
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
                                                                                              ɵRestMethod &
                                                                                              RestMethodMiddlewares)
        {
            if(isFunction(descriptor.value))
            {
                descriptor.originalParamsCount = descriptor.value.length;
            }

            descriptor.middlewareTypes = descriptor.middlewareTypes ?? [];

            const id = `${method}-${url}-${target.constructor.name}-${propertyKey}`;
            const parameters = target.parameters;
            let parametersMiddlewares: Type<RestMiddleware>[] = [];

            if(parameters)
            {
                parametersMiddlewares = parameters[propertyKey]?.middlewareTypes ?? [];
            }

            descriptor.value = function(this: RESTClient, ...args: any[])
            {
                //get middlewares definition only during first call
                if(!descriptor.middlewares)
                {
                    descriptor.middlewares = buildMiddlewares.bind(this)([
                                                                             ...descriptor.middlewareTypes ?? [],
                                                                             ...parametersMiddlewares,
                                                                             ...this.methodMiddlewares
                                                                         ],
                                                                         this.middlewaresOrder);
                }

                const reqId = `${id}-${generateId(6)}`;
 
                const httpRequest = new HttpRequest<any>(method,
                                                         this.baseUrl + this.getBaseUrl() + url,
                                                         null,
                                                         {
                                                              headers: new HttpHeaders(this.getDefaultHeaders()),
                                                              responseType: 'json',
                                                              reportProgress: false
                                                         });

                //run all middlewares
                const call = (httpReq: HttpRequest<any>, index: number): Observable<any> =>
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
                };

                return call(httpRequest, 0);

                // // Body

                // // Path
                
                // // QueryObject

                // // Query

                // // Headers
                // // set class default headers
                
                // // set parameter specific headers
                

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

                // let cached: boolean = false;
                // let hashKey: string;
                // let fromState = false;

                // //tries to get response from cache

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
                

                // //tries to set response to cache

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
export const GET = methodBuilder('GET');

/**
 * POST method
 * @param url - resource url of the method
 */
export const POST = methodBuilder('POST');

/**
 * PUT method
 * @param url - resource url of the method
 */
export const PUT = methodBuilder('PUT');

/**
 * DELETE method
 * @param url - resource url of the method
 */
export const DELETE = methodBuilder('DELETE');

/**
 * HEAD method
 * @param url - resource url of the method
 */
export const HEAD = methodBuilder('HEAD');

/**
 * PATCH method
 * @param url - resource url of the method
 */
export const PATCH = methodBuilder('PATCH');