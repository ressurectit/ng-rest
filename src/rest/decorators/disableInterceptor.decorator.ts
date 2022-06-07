import {Type} from '@angular/core';
import {isBlank} from '@jscrpt/common';

import type {RESTClient} from '../common';
import {RestDisabledInterceptors, RestMethodMiddlewares} from '../rest.interface';
import {IgnoredInterceptorsMiddleware} from '../middlewares';

/**
 * Disables specified type of http client interceptor for all calls of applied method
 * @param interceptorType - Type of interceptor that will be disabled for method to which is this attached
 */
export function DisableInterceptor<TType>(interceptorType: Type<TType>)
{
    return function<TDecorated>(_target: RESTClient, _propertyKey: string, descriptor: RestDisabledInterceptors<TType> &
                                                                                       RestMethodMiddlewares |
                                                                                       TDecorated): TypedPropertyDescriptor<any>
    {
        const descr = descriptor as RestDisabledInterceptors<TType> & RestMethodMiddlewares;

        if(isBlank(interceptorType))
        {
            return descr;
        }

        if(!Array.isArray(descr.disabledInterceptors))
        {
            descr.disabledInterceptors = [];
        }

        descr.middlewareTypes?.push(IgnoredInterceptorsMiddleware);
        descr.disabledInterceptors.push(interceptorType);

        return descr;
    };
}