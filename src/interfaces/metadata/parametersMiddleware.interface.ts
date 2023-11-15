import {RestMiddlewareType} from '../../misc/types';
import {RestMiddleware} from '../restMiddleware';

/**
 * Metadata for middleware types for parameters
 */
export interface ParametersMiddlewaresMetadata
{
    /**
     * Array of rest middleware types that will be used
     */
    middlewareTypes?: RestMiddlewareType<RestMiddleware>[];
}
