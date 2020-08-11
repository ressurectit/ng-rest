import {InjectionToken} from '@angular/core';

import {AvroAdapterSchemaProvider} from '../services/avroAdapterSchemaProvider/avroAdapterSchemaProvider.interface';
import {NoAvroAdapterSchemaProviderService} from '../services/avroAdapterSchemaProvider/noAvroAdapterSchemaProvider.service';

/**
 * Injection token used for providing AvroAdapterSchemaProvider
 */
export const AVRO_ADAPTER_SCHEMA_PROVIDER: InjectionToken<AvroAdapterSchemaProvider> = new InjectionToken<AvroAdapterSchemaProvider>('AVRO_ADAPTER_SCHEMA_PROVIDER', {providedIn: 'root', factory: () => new NoAvroAdapterSchemaProviderService()});