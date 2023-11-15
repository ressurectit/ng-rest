import {RestMiddlewareRunMethod} from '../../restMiddleware';

/**
 * Contains data that are stored when REST method is set
 */
export interface RestHttpMethod extends TypedPropertyDescriptor<unknown>
{
    /**
     * Array of middlewares that are executed for each request
     */
    middlewares?: RestMiddlewareRunMethod[];
}
