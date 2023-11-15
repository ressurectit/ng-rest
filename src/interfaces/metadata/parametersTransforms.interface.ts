import {ParameterTransformFunc} from '../parameterTransform/parameterTransform.interface';

/**
 * Defines object for parameter transforms
 */
export interface ParametersTransformsObj
{
    [parameterIndex: number]: ParameterTransformFunc;
}

/**
 * Metadata for parameters transforms
 */
export interface ParametersTransformMetadata
{
    transforms?: ParametersTransformsObj;
}