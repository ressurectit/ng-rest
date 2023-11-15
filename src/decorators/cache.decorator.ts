import {HttpRequest, HttpResponse} from '@angular/common/http';
import {Dictionary, isPresent} from '@jscrpt/common';

import {CacheMiddleware} from '../middlewares';
import type {RESTClientBase} from '../misc/classes/restClientBase';
import {RestCaching, RestMethodMiddlewares} from '../interfaces';

//Object storing response cache itself
//It caches request urls to response data
const responseCache: Dictionary<HttpResponse<unknown>> = {};

/**
 * Results of requests are cached in javascript memory
 */
export function Cache()
{
    return function<TDecorated>(_target: RESTClientBase, _propertyKey: string, descriptor: RestCaching &
                                                                                           RestMethodMiddlewares |
                                                                                           TDecorated): TDecorated
    {
        const descr = descriptor as RestCaching & RestMethodMiddlewares;

        descr.middlewareTypes.push(CacheMiddleware);

        descr.getCachedResponse = (request: HttpRequest<unknown>): HttpResponse<unknown>|null =>
        {
            if(isPresent(responseCache[request.urlWithParams]))
            {
                return responseCache[request.urlWithParams];
            }
            
            return null;
        };
        
        descr.saveResponseToCache = (request: HttpRequest<unknown>, response: HttpResponse<unknown>): HttpResponse<unknown> =>
        {
            responseCache[request.urlWithParams] = response;
            
            return response;
        };
        
        return descr as TDecorated;
    };
}