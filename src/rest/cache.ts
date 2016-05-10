import {Response, RequestOptions} from '@angular/http';
import {isPresent} from '@angular/core/src/facade/lang';

//Object storing response cache itself
//It caches request urls to response data
var responseCache: {[key: string]: Response} = {};

/**
 * Converts request options to request url
 * @param  {RequestOptions} request Request object
 */
function toRequestUrl(request: RequestOptions)
{
    return request.url + request.search.toString();
}

/**
 * Defines method name that will be called and modifies response
 * @param  {string} methodName Name of method that will be called to modify response, method takes Observable and returns required type
 */
export function Cache()
{
    return function(target: any, propertyKey: string, descriptor: any)
    {
        descriptor.getCachedResponse = (request: RequestOptions): Response =>
        {
            let url = toRequestUrl(request);
            
            if(isPresent(responseCache[url]))
            {
                return responseCache[url];
            }
            
            return null;
        };
        
        descriptor.saveResponseToCache = (request: RequestOptions, response: Response): Response =>
        {
            responseCache[toRequestUrl(request)] = response;
            
            return response;
        };
        
        return descriptor;
    };
}