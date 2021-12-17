import {Dictionary} from '@jscrpt/common';
import {Schema} from 'avsc';

/**
 * Service used for obtaining AVRO schema types
 */
export interface AvroAdapterSchemaProvider
{
    /**
     * Gets object containing namespaces and for each namespace types that are available in schema
     */
    readonly schema: Dictionary<Dictionary<Schema>>;
}