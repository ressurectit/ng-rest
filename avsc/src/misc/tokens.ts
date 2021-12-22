import {InjectionToken} from '@angular/core';
import {HttpContextToken} from '@angular/common/http';

import {AvroAdapterSchemaProvider} from '../services/avroAdapterSchemaProvider/avroAdapterSchemaProvider.interface';
import {NoAvroAdapterSchemaProviderService} from '../services/avroAdapterSchemaProvider/noAvroAdapterSchemaProvider.service';
import {AvroRequestObj, AvroResponseObj} from '../interceptors/avroAdapter/avroAdapter.interface';

/**
 * Injection token used for providing AvroAdapterSchemaProvider
 */
export const AVRO_ADAPTER_SCHEMA_PROVIDER: InjectionToken<AvroAdapterSchemaProvider> = new InjectionToken<AvroAdapterSchemaProvider>('AVRO_ADAPTER_SCHEMA_PROVIDER', {providedIn: 'root', factory: () => new NoAvroAdapterSchemaProviderService()});

/**
 * Http context token for passing AVRO request data with request
 */
export const AVRO_REQUEST_DATA: HttpContextToken<AvroRequestObj|null> = new HttpContextToken<AvroRequestObj|null>(() => null);

/**
 * Http context token for passing AVRO response data with request
 */
export const AVRO_RESPONSE_DATA: HttpContextToken<AvroResponseObj|null> = new HttpContextToken<AvroResponseObj|null>(() => null);
