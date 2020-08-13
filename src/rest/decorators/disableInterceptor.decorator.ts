import {Type} from '@angular/core';
import {isBlank} from '@jscrpt/common';

import {RESTClient} from '../common';
import {RestDisabledInterceptors, RestMethodMiddlewares} from '../rest.interface';
import {IgnoredInterceptorsMiddleware} from '../middlewares';

/**
 * Disables specified type of http client interceptor for all calls of applied method
 * @param interceptorType - Type of interceptor that will be disabled for method to which is this attached
 */
export function DisableInterceptor<TType>(interceptorType: Type<TType>)
{
    return function(_target: RESTClient, _propertyKey: string, descriptor: RestDisabledInterceptors<TType> &
                                                                           RestMethodMiddlewares)
    {
        if(isBlank(interceptorType))
        {
            return descriptor;
        }

        if(!descriptor.disabledInterceptors || !Array.isArray(descriptor.disabledInterceptors))
        {
            descriptor.disabledInterceptors = [];
        }

        descriptor.middlewareTypes.push(IgnoredInterceptorsMiddleware);
        descriptor.disabledInterceptors.push(interceptorType);

        return descriptor;
    };
}