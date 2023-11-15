import {RestMiddlewareOrderType, RestMiddlewareType} from '../../misc/types';
import {RestMiddleware, RestMiddlewareRunMethod} from '../restMiddleware';

/**
 * Defintion of buildMiddleware function type
 */
export interface BuildMiddlewaresFn
{
    /**
     * Builds and returns array of middleware run functions
     * @param middlewares - Array of set middleware types
     * @param middlewaresOrder - Array of middleware types in order that should be executed
     */
    (middlewares: RestMiddlewareType<RestMiddleware>[], middlewaresOrder: RestMiddlewareOrderType<string>[]): RestMiddlewareRunMethod[]
}
