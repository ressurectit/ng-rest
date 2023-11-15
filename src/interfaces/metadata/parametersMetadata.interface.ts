import {KeyIndex} from './keyIndex.interface';

/**
 * Metadata for parameters
 */
export interface ParametersMetadata
{
    path?: KeyIndex[];
    query?: KeyIndex[];
    queryObject?: KeyIndex[];
    body?: KeyIndex[];
    header?: KeyIndex[];
}
