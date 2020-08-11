import {Injectable, Inject, Optional, ClassProvider} from '@angular/core';
import {HttpInterceptor, HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpErrorResponse, HttpRequest} from '@angular/common/http';
import {IgnoredInterceptorsService, IgnoredInterceptorId, AdditionalInfo} from '@anglr/common';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {Schema, Type} from 'avsc';

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
                @Optional() @Inject(AVRO_ADAPTER_SCHEMA_PROVIDER) private _schemaProvider: AvroAdapterSchemaProvider)
    {
        if(!_options)
        {
            this._options = new AvroAdapterInterceptorOptions();
        }
    }

    //######################### public methods - implementation of HttpInterceptor #########################

    /**
     * Intercepts http request
     * @param req - Request to be intercepted
     * @param next - Next middleware that can be called for next processing
     */
    public intercept(req: HttpRequest<any> & AdditionalInfo<IgnoredInterceptorId & AvroRequestType & AvroResponseType>, next: HttpHandler): Observable<HttpEvent<any>>
    {
        if(this._options.disabled)
        {
            return next.handle(req);
        }

        //process request with avro
        if(req.additionalInfo?.avroRequest)
        {
            let avroReq = req.additionalInfo.avroRequest;
            let schemaObj = this._schemaProvider.schema;
            let schema: Schema;

            //body present and schema for specified type exists
            if(req.body && schemaObj[avroReq.namespace] && (schema = schemaObj[avroReq.namespace][name]))
            {
                let type = Type.forSchema(schema);
                let additionalHeaders = {};

                if(this._options.typeHeaderName)
                {
                    additionalHeaders[this._options.typeHeaderName] = type.name;
                }

                if(this._options.fingerprintHeaderName)
                {
                    additionalHeaders[this._options.fingerprintHeaderName] = type.fingerprint();
                }

                req = req.clone(
                {
                    body: type.toBuffer(req.body).buffer,
                    setHeaders: additionalHeaders
                });
            }
        }

        //adds header for Accept header
        if(req.additionalInfo?.avroResponse && this._options.customAcceptHeader)
        {
            req = req.clone(
            {
                setHeaders:
                {
                    'Accept': this._options.customAcceptHeader
                }
            });
        }

        return next.handle(req)
            .pipe(tap(_data =>
                      {
                          //is ignored
                          if (this._ignoredInterceptorsService && this._ignoredInterceptorsService.isIgnored(AvroAdapterInterceptor, req.additionalInfo))
                          {
                              return;
                          }
                          
                          //process response with avro
                          if(req.additionalInfo?.avroResponse)
                          {
                              console.log('AVRO response', req.additionalInfo);
                          }
                      },
                      (err: HttpErrorResponse) =>
                      {
                          //client error, not response from server, or is ignored
                          if (err.error instanceof Error || 
                              (this._ignoredInterceptorsService && this._ignoredInterceptorsService.isIgnored(AvroAdapterInterceptor, req.additionalInfo)))
                          {
                              return;
                          }
                      
                          //process response with avro
                          if(req.additionalInfo?.avroResponse)
                          {
                              console.log('AVRO error response', req.additionalInfo);
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