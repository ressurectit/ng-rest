import {Injectable, Inject, Optional, ClassProvider} from '@angular/core';
import {HttpInterceptor, HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpRequest, HttpEventType} from '@angular/common/http';
import {IGNORED_INTERCEPTORS} from '@anglr/common';
import {HTTP_HEADER_CONTENT_TYPE} from '@anglr/rest';
import {StringDictionary} from '@jscrpt/common';
import {Observable, map} from 'rxjs';
import {Schema, Type} from 'avsc';

import {AvroAdapterInterceptorOptions} from './avroAdapter.options';
import {AVRO_ADAPTER_SCHEMA_PROVIDER, AVRO_REQUEST_DATA, AVRO_RESPONSE_DATA} from '../../misc/tokens';
import {AvroAdapterSchemaProvider} from '../../services/avroAdapterSchemaProvider/avroAdapterSchemaProvider.interface';

/**
 * Interceptor that will enable usage of AVRO for request and response data streams (binary format)
 */
@Injectable()
export class AvroAdapterInterceptor implements HttpInterceptor
{
    //######################### constructor #########################
    constructor(@Optional() private _options: AvroAdapterInterceptorOptions,
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
    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
    {
        //interceptor is ignored
        if(req.context.get(IGNORED_INTERCEPTORS).some(itm => itm == AvroAdapterInterceptor))
        {
            return next.handle(req);
        }

        const avroReq = req.context.get(AVRO_REQUEST_DATA);
        const avroRes = req.context.get(AVRO_RESPONSE_DATA);
        const schemaObj = this._schemaProvider.schema;

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
                const type = Type.forSchema(schema);
                const additionalHeaders: StringDictionary = {};

                additionalHeaders[HTTP_HEADER_CONTENT_TYPE] = this._options.customAcceptContentTypeHeader;

                if(this._options.typeHeaderName && type.name)
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
                              const type = Type.forSchema(schema);

                              return result.clone<any>(
                              {
                                  body: type.fromBuffer(Buffer.from(new Uint8Array(result.body)))
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