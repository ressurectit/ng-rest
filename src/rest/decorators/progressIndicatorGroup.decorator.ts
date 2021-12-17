import {LocalProgressIndicatorName} from '@anglr/common';

import {RESTClient} from '../common';
import {AdditionalInfoPropertyDescriptor, RestMethodMiddlewares} from '../rest.interface';
import {AdditionalDataMiddleware} from '../middlewares';

/**
 * Allows to specify progress indicator group for displaying local progress indicator
 * @param name - Name of progress indicator group to be displayed
 */
export function ProgressIndicatorGroup(name: string)
{
    return function(_target: RESTClient, _propertyKey: string, descriptor: AdditionalInfoPropertyDescriptor<LocalProgressIndicatorName> &
                                                                           RestMethodMiddlewares)
    {
        if(!descriptor.additionalInfo)
        {
            descriptor.additionalInfo = {};
        }

        descriptor.middlewareTypes.push(AdditionalDataMiddleware);
        descriptor.additionalInfo.progressGroupName = name;

        return descriptor;
    };
}