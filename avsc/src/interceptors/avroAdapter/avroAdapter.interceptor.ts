import {Injectable, Inject, Optional, ClassProvider} from '@angular/core';
import {HttpInterceptor, HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpRequest, HttpEventType} from '@angular/common/http';
import {IgnoredInterceptorsService, IgnoredInterceptorId, AdditionalInfo} from '@anglr/common';
import {HTTP_HEADER_CONTENT_TYPE} from '@anglr/rest';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
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
        let avroReq = req.additionalInfo?.avroRequest;
        let avroRes = req.additionalInfo?.avroResponse;
        let schemaObj = this._schemaProvider.schema;

        if(this._options.disabled ||
           (!avroReq && !avroRes))
        {
            return next.handle(req);
        }

        //process request with avro
        if(avroReq)
        {
            let schema: Schema;

            //body present and schema for specified type exists and content type provided
            if(req.body && schemaObj[avroReq.namespace] && (schema = schemaObj[avroReq.namespace][avroReq.name]) && this._options.customAcceptContentTypeHeader)
            {
                let type = Type.forSchema(schema);
                let additionalHeaders = {};

                additionalHeaders[HTTP_HEADER_CONTENT_TYPE] = this._options.customAcceptContentTypeHeader;

                if(this._options.typeHeaderName)
                {
                    additionalHeaders[this._options.typeHeaderName] = type.name;
                }

                if(this._options.fingerprintHeaderName)
                {
                    additionalHeaders[this._options.fingerprintHeaderName] = type.fingerprint().toString('hex');
                }

                req = req.clone(
                {
                    body: type.toBuffer(req.body).buffer,
                    setHeaders: additionalHeaders
                });
            }
        }

        //adds header for Accept header
        if(avroRes && this._options.customAcceptContentTypeHeader)
        {
            req = req.clone(
            {
                responseType: 'arraybuffer',
                setHeaders:
                {
                    'Accept': this._options.customAcceptContentTypeHeader
                }
            });
        }

        return next.handle(req)
            .pipe(map(result =>
                      {
                          //is ignored
                          if (this._ignoredInterceptorsService && this._ignoredInterceptorsService.isIgnored(AvroAdapterInterceptor, req.additionalInfo))
                          {
                              return result;
                          }
                          
                          //process only response
                          if(result.type != HttpEventType.Response)
                          {
                              return result;
                          }

                          let schema: Schema;

                          //process response with avro
                          if(avroRes && result.headers.get(HTTP_HEADER_CONTENT_TYPE) == this._options.customAcceptContentTypeHeader &&
                             schemaObj[avroRes.namespace] && (schema = schemaObj[avroRes.namespace][avroRes.name]))
                          {
                              let type = Type.forSchema(schema);

                              return result.clone<any>(
                              {
                                  body: type.fromBuffer(new Buffer(new Uint8Array(result.body)))
                              });
                          }

                          return result;
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