import {HttpRequest} from '@angular/common/http';
import {isBlank} from '@jscrpt/common';
import {Observable} from 'rxjs';

import {RestMiddleware, RestResponseType} from '../rest.interface';
import {ResponseType} from '../responseType';
import type {RESTClient} from '../common';

/**
 * Middleware that is used for changing response type
 */
export class ProducesMiddleware implements RestMiddleware
{
    //######################### public static properties #########################

    /**
     * String identification of middleware
     */
    public static id: string = 'ProducesMiddleware';

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
               next: (request: HttpRequest<unknown>) => Observable<unknown>): Observable<unknown>
    {
        if(isBlank(descriptor.responseType))
        {
            return next(request);
        }

        let responseType: 'json'|'text'|'blob'|'arraybuffer';

        switch(descriptor.responseType)
        {
            case ResponseType.Json:
            case ResponseType.LocationHeaderAndJson:
            {
                responseType = 'json';

                break;
            }
            case ResponseType.LocationHeader:
            case ResponseType.Text:
            {
                responseType = 'text';

                break;
            }
            case ResponseType.Blob:
            case ResponseType.BlobAndFilename:
            {
                responseType = 'blob';

                break;
            }
            case ResponseType.ArrayBuffer:
            {
                responseType = 'arraybuffer';

                break;
            }
        }

        request = request.clone(
        {
            responseType: responseType
        });

        return next(request);
    }
}