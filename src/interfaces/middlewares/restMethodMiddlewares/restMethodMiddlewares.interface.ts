import {RestMiddlewareType} from '../../../misc/types';
import {RestMiddleware} from '../../restMiddleware';

/**
 * Contains rest middleware types that will be used, decorator can add type if it wish to be used
 */
export interface RestMethodMiddlewares extends TypedPropertyDescriptor<unknown>
{
    /**
     * Array of rest middleware types that will be used
     */
    middlewareTypes?: RestMiddlewareType<RestMiddleware>[];
}