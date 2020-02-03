import {HttpRequest, HttpResponse} from '@angular/common/http';
import {isPresent} from '@jscrpt/common';

import {RESTClient} from '../rest/common';

//Object storing response cache itself
//It caches request urls to response data
var responseCache: {[key: string]: HttpResponse<any>} = {};

/**
 * Results of requests are cached in javascript memory
 */
export function Cache()
{
    return function(_target: RESTClient, _propertyKey: string, descriptor: any)
    {
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