import {Type} from '@angular/core';
import {isBlank} from '@jscrpt/common';

import {RESTClient} from '../common';
import {RestDisabledInterceptors} from '../rest.interface';

/**
 * Disables specified type of http client interceptor for all calls of applied method
 * @param interceptorType - Type of interceptor that will be disabled for method to which is this attached
 */
export function DisableInterceptor<TType>(interceptorType: Type<TType>)
{
    return function(_target: RESTClient, _propertyKey: string, descriptor: RestDisabledInterceptors<TType>)
    {
        if(isBlank(interceptorType))
        {
            return descriptor;
        }

        if(!descriptor.disabledInterceptors || !Array.isArray(descriptor.disabledInterceptors))
        {
            descriptor.disabledInterceptors = [];
        }

        descriptor.disabledInterceptors.push(interceptorType);

        return descriptor;
    };
}