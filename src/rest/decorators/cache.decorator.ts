import {HttpRequest, HttpResponse} from '@angular/common/http';
import {isPresent} from '@jscrpt/common';

import {RestCaching, RestMethodMiddlewares} from '../rest.interface';
import {RESTClient} from '../common';
import {CacheMiddleware} from '../middlewares';

//Object storing response cache itself
//It caches request urls to response data
var responseCache: {[key: string]: HttpResponse<any>} = {};

/**
 * Results of requests are cached in javascript memory
 */
export function Cache()
{
    return function(_target: RESTClient, _propertyKey: string, descriptor: RestCaching &
                                                                           RestMethodMiddlewares)
    {
        descriptor.middlewareTypes.push(CacheMiddleware);

        descriptor.getCachedResponse = (request: HttpRequest<any>): HttpResponse<any>|null =>
        {
            if(isPresent(responseCache[request.urlWithParams]))
            {
                return responseCache[request.urlWithParams];
            }
            
            return null;
        };
        
        descriptor.saveResponseToCache = (request: HttpRequest<any>, response: HttpResponse<any>): HttpResponse<any> =>
        {
            responseCache[request.urlWithParams] = response;
            
            return response;
        };
        
        return descriptor;
    };
}