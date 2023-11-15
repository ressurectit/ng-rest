import {PromiseOr} from '@jscrpt/common';

import type {RESTClientBase} from '../../misc/classes/restClientBase';

/**
 * Function that is used as parameter transform function
 */
export interface ParameterTransformFunc<TData = unknown, TTransformedData = TData>
{
    (this: RESTClientBase, data: TData, ...args: unknown[]): PromiseOr<TTransformedData>;
}