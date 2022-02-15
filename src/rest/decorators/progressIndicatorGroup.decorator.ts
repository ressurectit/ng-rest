import {isPresent} from '@jscrpt/common';

import {RESTClient} from '../common';
import {ProgressIndicatorGroupMiddleware} from '../middlewares';
import {RestMethodMiddlewares, RestProgressIndicatorGroup} from '../rest.interface';

/**
 * Allows to specify progress indicator group for displaying local progress indicator
 * @param name - Name of progress indicator group to be displayed
 */
export function ProgressIndicatorGroup(name: string)
{
    return function(_target: RESTClient, _propertyKey: string, descriptor: Partial<RestProgressIndicatorGroup> &
                                                                           RestMethodMiddlewares): TypedPropertyDescriptor<any>
    {
        if(isPresent(name))
        {
            descriptor.middlewareTypes?.push(ProgressIndicatorGroupMiddleware);
            descriptor.groupName = name;
        }

        return descriptor;
    };
}
