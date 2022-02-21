import {HttpRequest, HttpResponse} from '@angular/common/http';
import {Dictionary, isPresent} from '@jscrpt/common';

import {RestCaching, RestMethodMiddlewares} from '../rest.interface';
import {RESTClient} from '../common';
import {CacheMiddleware} from '../middlewares';

//Object storing response cache itself
//It caches request urls to response data
const responseCache: Dictionary<HttpResponse<any>> = {};

/**
 * Results of requests are cached in javascript memory
 */
export function Cache()
{
    return function<TDecorated>(_target: RESTClient, _propertyKey: string, descriptor: RestCaching &
                                                                                       RestMethodMiddlewares |
                                                                                       TDecorated): TypedPropertyDescriptor<any>
    {
        const descr = descriptor as RestCaching & RestMethodMiddlewares;

        descr.middlewareTypes?.push(CacheMiddleware);

        descr.getCachedResponse = (request: HttpRequest<any>): HttpResponse<any>|null =>
        {
            if(isPresent(responseCache[request.urlWithParams]))
            {
                return responseCache[request.urlWithParams];
            }
            
            return null;
        };
        
        descr.saveResponseToCache = (request: HttpRequest<any>, response: HttpResponse<any>): HttpResponse<any> =>
        {
            responseCache[request.urlWithParams] = response;
            
            return response;
        };
        
        return descr;
    };
}