import {RESTClientBase} from '../misc/classes/restClientBase';

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
                                                                                                          TDecorated)
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

            descr.value = function(this: RESTClient, ...args: any[])
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

            return descr;
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