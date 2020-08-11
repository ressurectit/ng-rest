import {Injectable} from '@angular/core';
import {Dictionary} from '@jscrpt/common';
import {Schema} from 'avsc';

import {AvroAdapterSchemaProvider} from './avroAdapterSchemaProvider.interface';

/**
 * Default implementation of AvroAdapterSchemaProvider that does nothing
 */
@Injectable()
export class NoAvroAdapterSchemaProviderService implements AvroAdapterSchemaProvider
{
    //######################### public properties - implementation of AvroAdapterSchemaProvider #########################
    /**
     * Gets object containing namespaces and for each namespace types that are available in schema
     */
    public get schema(): Dictionary<Dictionary<Schema>>
    {
        return {};
    }
}