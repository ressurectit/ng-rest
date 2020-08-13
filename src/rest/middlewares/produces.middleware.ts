import {HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';

import {RestMiddleware, ɵRESTClient, RestResponseType} from '../rest.interface';
import {ResponseType} from '../responseType';

/**
 * Middleware that is used for changing response type
 */
export class ProducesMiddleware implements RestMiddleware
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
               next: (request: HttpRequest<any>) => Observable<any>): Observable<any>
    {
        if(!descriptor.responseType)
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