import {isPresent} from '@jscrpt/common';

import {ProgressIndicatorGroupMiddleware} from '../middlewares';
import type {RESTClientBase} from '../misc/classes/restClientBase';
import {RestMethodMiddlewares, RestProgressIndicatorGroup} from '../interfaces';

/**
 * Allows to specify progress indicator group for displaying local progress indicator
 * @param name - Name of progress indicator group to be displayed
 */
export function ProgressIndicatorGroup(name: string)
{
    return function<TDecorated>(_target: RESTClientBase, _propertyKey: string, descriptor: RestProgressIndicatorGroup &
                                                                                           RestMethodMiddlewares |
                                                                                           TDecorated): TDecorated
    {
        const descr = descriptor as RestProgressIndicatorGroup & RestMethodMiddlewares;

        if(isPresent(name))
        {
            descr.middlewareTypes.push(ProgressIndicatorGroupMiddleware);
            descr.groupName = name;
        }

        return descr as TDecorated;
    };
}
