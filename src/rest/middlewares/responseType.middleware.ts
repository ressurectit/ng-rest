import {HttpRequest, HttpEvent, HttpResponse} from '@angular/common/http';
import {isPresent} from '@jscrpt/common';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {RestMiddleware, ɵRESTClient, RestResponseType} from '../rest.interface';
import {ResponseType} from '../responseType';

/**
 * Middleware that is used for extracting http body and transforming it according to specified response type
 */
export class ResponseTypeMiddleware implements RestMiddleware<any, any, RestResponseType, any>
{
    //######################### public methods - implementation of RestMiddleware #########################

    /**
     * Runs code that is defined for this rest middleware, in this method you can modify request and response
     * @param this - Method is bound to RESTClient
     * @param id - Unique id that identifies request method
     * @param target - Prototype of class that are decorators applied to
     * @param methodName - Name of method that is being modified
     * @param descriptor - Descriptor of method that is being modified
     * @param args - Array of arguments passed to called method
     * @param request - Http request that you can modify
     * @param next - Used for calling next middleware with modified request
     */
    public run(this: ɵRESTClient,
               _id: string,
               _target: any,
               _methodName: string,
               descriptor: RestResponseType,
               _args: any[],
               request: HttpRequest<any>,
               next: <TNextRequestBody = any, TNextResponseBody = HttpEvent<any> | any>(request: HttpRequest<TNextRequestBody>) => Observable<TNextResponseBody>): Observable<any>
    {
        let responseType = descriptor.responseType ?? ResponseType.Json;
        let observable = next(request);

        // transform the obserable in accordance to the @Produces decorator
        // TODO: if (!fromState)
        if (isPresent(responseType))
        {
            switch(responseType)
            {
                default:
                case ResponseType.Text:
                case ResponseType.Json:
                case ResponseType.Blob:
                case ResponseType.ArrayBuffer:
                {
                    observable = observable.pipe(map((res: HttpResponse<any>) => res.body));

                    break;
                }
                case ResponseType.BlobAndFilename:
                {
                    observable = observable.pipe(map((res: HttpResponse<any>) =>
                    {
                        let contentDisposition = res.headers.get("content-disposition");
                        let filename = contentDisposition ? contentDisposition.replace(/.*filename=\"(.+)\"/, "$1") : "";

                        return <any>{
                            filename: filename,
                            blob: res.body
                        };
                    }));

                    break;
                }
                case ResponseType.LocationHeader:
                {
                    observable = observable!.pipe(map((res: HttpResponse<any>) =>
                    {
                        let headerValue = res.headers.get("location");
                        let baseUrl = res.url!.replace(/^http(?:s)?:\/\/.*?\//, '/');
                        let url = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';

                        return <any>{
                            location: headerValue,
                            id: isPresent(headerValue) ? headerValue!.replace(url, "") : null
                        };
                    }));

                    break;
                }
                case ResponseType.LocationHeaderAndJson:
                {
                    observable = observable!.pipe(map((res: HttpResponse<any>) =>
                    {
                        let headerValue = res.headers.get("location");
                        let baseUrl = res.url!.replace(/^http(?:s)?:\/\/.*?\//, '/');
                        let url = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';

                        return <any>{
                            location: headerValue,
                            id: isPresent(headerValue) ? headerValue!.replace(url, "") : null,
                            data: res.body
                        };
                    }));

                    break;
                }
            }
        }

        return observable;
    }
}