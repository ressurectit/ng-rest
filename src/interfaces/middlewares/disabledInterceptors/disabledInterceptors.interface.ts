import {Type} from '@angular/core';

/**
 * Contains array of interceptor types that will be disabled
 */
export interface RestDisabledInterceptors<TType = unknown> extends TypedPropertyDescriptor<unknown>
{
    /**
     * Array of interceptors types that will be disabled
     */
    disabledInterceptors: Type<TType>[];
}