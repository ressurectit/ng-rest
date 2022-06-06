import {HttpRequest, HttpResponse} from '@angular/common/http';
import {isPresent} from '@jscrpt/common';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {RestMiddleware, RestResponseType} from '../rest.interface';
import {ResponseType} from '../responseType';
import type {RESTClient} from '../common';

/**
 * Middleware that is used for extracting http body and transforming it according to specified response type
 */
export class ResponseTypeMiddleware implements RestMiddleware
{
    //######################### public static properties #########################

    /**
     * String identification of middleware
     */
    public static id: string = 'ResponseTypeMiddleware';

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
    public run(this: RESTClient,
               _id: string,
               _target: unknown,
               _methodName: string,
               descriptor: RestResponseType,
               _args: unknown[],
               request: HttpRequest<unknown>,
               next: (request: HttpRequest<unknown>) => Observable<HttpResponse<unknown>>): Observable<unknown>
    {
        const responseType = descriptor.responseType ?? ResponseType.Json;
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
                        const contentDisposition = res.headers.get('content-disposition');
                        const filename = contentDisposition ? contentDisposition.replace(/.*filename="(.+)"/, '$1') : '';

                        return <any>{
                            filename: filename,
                            blob: res.body
                        };
                    }));

                    break;
                }
                case ResponseType.LocationHeader:
                {
                    observable = observable.pipe(map((res: HttpResponse<any>) =>
                    {
                        const headerValue = res.headers.get('location');
                        const baseUrl = res.url!.replace(/^http(?:s)?:\/\/.*?\//, '/');
                        const url = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';

                        return {
                            location: headerValue,
                            id: isPresent(headerValue) ? headerValue.replace(url, '') : null
                        } as any;
                    }));

                    break;
                }
                case ResponseType.LocationHeaderAndJson:
                {
                    observable = observable.pipe(map((res: HttpResponse<any>) =>
                    {
                        const headerValue = res.headers.get('location');
                        const baseUrl = res.url!.replace(/^http(?:s)?:\/\/.*?\//, '/');
                        const url = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';

                        return <any>{
                            location: headerValue,
                            id: isPresent(headerValue) ? headerValue.replace(url, '') : null,
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