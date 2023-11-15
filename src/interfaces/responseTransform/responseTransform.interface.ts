import {Observable} from 'rxjs';

import type {RESTClientBase} from '../../misc/classes/restClientBase';

/**
 * Function that is used as response transform function
 */
export interface ResponseTransformFunc<TResponse = unknown, TTransformedResponse = TResponse>
{
    (this: RESTClientBase, response: Observable<TResponse>, ...args: unknown[]): Observable<TTransformedResponse>;
}