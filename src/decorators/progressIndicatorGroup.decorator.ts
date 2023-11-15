import {isPresent} from '@jscrpt/common';

import type {RESTClient} from '../rest/common';
import {ProgressIndicatorGroupMiddleware} from '../middlewares';
import {RestMethodMiddlewares, RestProgressIndicatorGroup} from '../rest/rest.interface';

/**
 * Allows to specify progress indicator group for displaying local progress indicator
 * @param name - Name of progress indicator group to be displayed
 */
export function ProgressIndicatorGroup(name: string)
{
    return function<TDecorated>(_target: RESTClient, _propertyKey: string, descriptor: Partial<RestProgressIndicatorGroup> &
                                                                                       RestMethodMiddlewares |
                                                                                       TDecorated): TypedPropertyDescriptor<any>
    {
        const descr = descriptor as Partial<RestProgressIndicatorGroup> & RestMethodMiddlewares;

        if(isPresent(name))
        {
            descr.middlewareTypes?.push(ProgressIndicatorGroupMiddleware);
            descr.groupName = name;
        }

        return descr;
    };
}
