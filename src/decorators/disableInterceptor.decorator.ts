import {Type} from '@angular/core';
import {HttpInterceptor} from '@angular/common/http';
import {isBlank} from '@jscrpt/common';

import {IgnoredInterceptorsMiddleware} from '../middlewares';
import type {RESTClientBase} from '../misc/classes/restClientBase';
import {RestDisabledInterceptors, RestMethodMiddlewares} from '../interfaces';

/**
 * Disables specified type of http client interceptor for all calls of applied method
 * @param interceptorType - Type of interceptor that will be disabled for method to which is this attached
 */
export function DisableInterceptor<TType extends HttpInterceptor>(interceptorType: Type<TType>)
{
    return function<TDecorated>(_target: RESTClientBase, _propertyKey: string, descriptor: RestDisabledInterceptors<TType> &
                                                                                           RestMethodMiddlewares |
                                                                                           TDecorated): TDecorated
    {
        const descr = descriptor as RestDisabledInterceptors<TType> & RestMethodMiddlewares;

        if(isBlank(interceptorType))
        {
            return descr as TDecorated;
        }

        if(!Array.isArray(descr.disabledInterceptors))
        {
            descr.disabledInterceptors = [];
        }

        descr.middlewareTypes.push(IgnoredInterceptorsMiddleware);
        descr.disabledInterceptors.push(interceptorType);

        return descr as TDecorated;
    };
}