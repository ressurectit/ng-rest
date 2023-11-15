import {Dictionary} from '@jscrpt/common';

import {ParametersMetadata} from './parametersMetadata.interface';
import {ParametersTransformMetadata} from './parametersTransforms.interface';
import {ParametersMiddlewaresMetadata} from './parametersMiddleware.interface';

/**
 * Contains parameters metadata for each decorated method parameters
 */
export interface RestParameters
{
    /**
     * Parameters metadata for each decorated method
     */
    parameters?: Dictionary<ParametersMetadata&ParametersTransformMetadata&ParametersMiddlewaresMetadata>;
}
