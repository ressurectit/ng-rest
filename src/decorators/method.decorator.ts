import {HttpHeaders, HttpRequest} from '@angular/common/http';
import {generateId, isFunction} from '@jscrpt/common';
import {Observable} from 'rxjs';

import {RestHttpMethod, RestMethod, RestMethodMiddlewares, RestMiddleware, RestParameters} from '../interfaces';
import type {RESTClientBase} from '../misc/classes/restClientBase';
import {RestMiddlewareType} from '../misc/types';
import {buildMiddlewares} from '../misc/utils';

/**
 * Method builder used for building decorators for http methods
 * @param method - Name of http method
 */
function methodBuilder(method: string)
{
    return function(url: string)
    {
        return function<TDecorated>(target: RESTClientBase & RestParameters, propertyKey: string, descriptor: RestMethod &
                                                                                                              RestHttpMethod &
                                                                                                              RestMethodMiddlewares |
                                                                                                              TDecorated): TDecorated
        {
            const descr = descriptor as RestMethod & RestHttpMethod & RestMethodMiddlewares;

            if(isFunction(descr.value))
            {
                descr.originalParamsCount = descr.value.length;
            }

            descr.middlewareTypes = descr.middlewareTypes ?? [];

            const id = `${method}-${url}-${target.constructor.name}-${propertyKey}`;
            const parameters = target.parameters;
            let parametersMiddlewares: RestMiddlewareType<RestMiddleware>[] = [];

            if(parameters)
            {
                parametersMiddlewares = parameters[propertyKey]?.middlewareTypes ?? [];
            }

            descr.value = function(this: RESTClientBase, ...args: unknown[])
            {
                //get middlewares definition only during first call
                if(!descr.middlewares)
                {
                    descr.middlewares = buildMiddlewares([
                                                             ...descr.middlewareTypes ?? [],
                                                             ...parametersMiddlewares,
                                                             ...this.methodMiddlewares
                                                         ],
                                                         this.middlewaresOrder);
                }

                const reqId = `${id}-${generateId(6)}`;
 
                const httpRequest = new HttpRequest<unknown>(method,
                                                             this.baseUrl + this.getBaseUrl() + url,
                                                             null,
                                                             {
                                                                  headers: new HttpHeaders(this.getDefaultHeaders()),
                                                                  responseType: 'json',
                                                                  reportProgress: false,
                                                             });

                //run all middlewares
                const call = (httpReq: HttpRequest<unknown>, index: number): Observable<unknown> =>
                {
                    if(!descr.middlewares[index])
                    {
                        httpReq = this.requestInterceptor(httpReq);

                        let response = this.http.request(httpReq);

                        response = this.responseInterceptor(response);

                        return response;
                    }
                    else
                    {
                        return descr.middlewares[index].call(this,
                                                             reqId,
                                                             target,
                                                             propertyKey,
                                                             descr,
                                                             args,
                                                             httpReq,
                                                             request => call(request, ++index));
                    }
                };

                return call(httpRequest, 0);
            };

            return descr as TDecorated;
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