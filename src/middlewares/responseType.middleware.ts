import {HttpRequest, HttpResponse} from '@angular/common/http';
import {isPresent} from '@jscrpt/common';
import {Observable, map} from 'rxjs';

import {BlobAndFilenameResponse, LocationHeaderAndJsonResponse, LocationHeaderResponse, RestMiddleware, RestResponseType} from '../interfaces';
import type {RESTClientBase} from '../misc/classes/restClientBase';
import {ResponseType} from '../misc/enums';

/**
 * Middleware that is used for extracting http body and transforming it according to specified response type
 */
export class ResponseTypeMiddleware implements RestMiddleware<unknown, unknown, RestResponseType, unknown, HttpResponse<unknown>>
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
    public run(this: RESTClientBase,
               _id: string,
               _target: unknown,
               _methodName: string,
               descriptor: RestResponseType,
               _args: unknown[],
               request: HttpRequest<unknown>,
               next: (request: HttpRequest<unknown>) => Observable<HttpResponse<unknown>>): Observable<unknown>
    {
        const responseType = descriptor.responseType ?? ResponseType.Json;
        const origialObservable = next(request);
        let observable: Observable<unknown> = origialObservable;

        // transform the obserable in accordance to the @Produces decorator
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
                    observable = origialObservable.pipe(map(res => res.body));

                    break;
                }
                case ResponseType.BlobAndFilename:
                {
                    observable = origialObservable.pipe(map(res =>
                    {
                        const contentDisposition = res.headers.get('content-disposition');
                        const filename = contentDisposition?.replace(/.*filename="(.+)"/, '$1') ?? '';

                        return <BlobAndFilenameResponse>{
                            filename: filename,
                            blob: res.body
                        };
                    }));

                    break;
                }
                case ResponseType.LocationHeader:
                {
                    observable = origialObservable.pipe(map(res =>
                    {
                        const headerValue = res.headers.get('location');
                        const baseUrl = res.url!.replace(/^http(?:s)?:\/\/.*?\//, '/');
                        const url = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';

                        return <LocationHeaderResponse>{
                            location: headerValue,
                            id: isPresent(headerValue) ? headerValue.replace(url, '') : null
                        };
                    }));

                    break;
                }
                case ResponseType.LocationHeaderAndJson:
                {
                    observable = origialObservable.pipe(map(res =>
                    {
                        const headerValue = res.headers.get('location');
                        const baseUrl = res.url!.replace(/^http(?:s)?:\/\/.*?\//, '/');
                        const url = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';

                        return <LocationHeaderAndJsonResponse>{
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