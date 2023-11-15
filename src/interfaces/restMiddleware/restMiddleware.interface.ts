import {RestMiddlewareRunMethod} from './restMiddlewareRun.interface';

/**
 * Definition of rest middleware that will be pluged in to processing of request and response
 */
export interface RestMiddleware<TRequestBody = unknown, TResponseBody = unknown, TDescriptor = unknown, TTarget = unknown, TNextResponse = unknown>
{
    /**
     * Runs code that is defined for this rest middleware, in this method you can modify request and response
     * @param id - Unique id that identifies request method
     * @param target - Prototype of class that are decorators applied to
     * @param methodName - Name of method that is being modified
     * @param descriptor - Descriptor of method that is being modified
     * @param request - Http request that you can modify
     * @param next - Used for calling next middleware with modified request
     */
    run: RestMiddlewareRunMethod<TRequestBody, TResponseBody, TDescriptor, TTarget, TNextResponse>;
}