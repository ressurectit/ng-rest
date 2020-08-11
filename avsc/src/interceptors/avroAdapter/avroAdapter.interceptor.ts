import {Injectable, Inject, Optional, ClassProvider} from '@angular/core';
import {HttpInterceptor, HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpErrorResponse, HttpRequest} from '@angular/common/http';
import {IgnoredInterceptorsService, IgnoredInterceptorId, AdditionalInfo} from '@anglr/common';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

import {AvroAdapterInterceptorOptions} from './avroAdapter.options';
import {AVRO_ADAPTER_SCHEMA_PROVIDER} from '../../misc/tokens';
import {AvroAdapterSchemaProvider} from '../../services/avroAdapterSchemaProvider/avroAdapterSchemaProvider.interface';
import {AvroResponseType, AvroRequestType} from './avroAdapter.interface';

/**
 * Interceptor that will enable usage of AVRO for request and response data streams (binary format)
 */
@Injectable()
export class AvroAdapterInterceptor implements HttpInterceptor
{
    //######################### constructor #########################
    constructor(@Optional() private _options: AvroAdapterInterceptorOptions,
                @Optional() private _ignoredInterceptorsService: IgnoredInterceptorsService,
                @Optional() @Inject(AVRO_ADAPTER_SCHEMA_PROVIDER) private _responseMapper: AvroAdapterSchemaProvider)
    {
        if(!_options)
        {
            this._options = new AvroAdapterInterceptorOptions();
        }

        console.log(this._options, this._responseMapper)
    }

    //######################### public methods - implementation of HttpInterceptor #########################

    /**
     * Intercepts http request
     * @param req - Request to be intercepted
     * @param next - Next middleware that can be called for next processing
     */
    public intercept(req: HttpRequest<any> & AdditionalInfo<IgnoredInterceptorId & AvroRequestType & AvroResponseType>, next: HttpHandler): Observable<HttpEvent<any>>
    {
        //TODO - finish

        return next.handle(req)
            .pipe(tap(() => {}, (err: HttpErrorResponse) =>
            {
                //client error, not response from server, or is ignored
                if (err.error instanceof Error || 
                    (this._ignoredInterceptorsService && this._ignoredInterceptorsService.isIgnored(AvroAdapterInterceptor, req.additionalInfo)))
                {
                    return;
                }

                //TODO - finish
            }));
    }
}

/**
 * Provider for proper use of AvroAdapterInterceptor, use this provider to inject this interceptor
 */
export const AVRO_ADAPTER_INTERCEPTOR_PROVIDER: ClassProvider = 
{
    provide: HTTP_INTERCEPTORS,
    multi: true,
    useClass: AvroAdapterInterceptor
};