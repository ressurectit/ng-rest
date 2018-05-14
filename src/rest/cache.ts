import {HttpRequest, HttpResponse} from '@angular/common/http';
import {isPresent} from '@anglr/common';

//Object storing response cache itself
//It caches request urls to response data
var responseCache: {[key: string]: HttpResponse<any>} = {};

/**
 * Defines method name that will be called and modifies response
 * @param  {string} methodName Name of method that will be called to modify response, method takes Observable and returns required type
 */
export function Cache()
{
    return function(_target: any, _propertyKey: string, descriptor: any)
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