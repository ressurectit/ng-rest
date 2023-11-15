import {RestMiddleware} from '../../interfaces';
import {RestMiddlewareType} from '../types';

/**
 * Type indicates that it should be removed from array
 */
export class NotType<TType extends RestMiddleware>
{
    //######################### constructor #########################
    constructor(public ɵtype: RestMiddlewareType<TType>)
    {
    }
}