import {ParameterTransformFunc} from '../parameterTransform/parameterTransform.interface';

/**
 * Data that represents item during iteration of params data
 */
export interface ParamsDataIteratorItem<TData = unknown>
{
    /**
     * Bound Parameter transformation function
     */
    transformFn: ParameterTransformFunc<TData, TData>|undefined|null;

    /**
     * Index of parameter in array of parameters
     */
    index: number;

    /**
     * Value of parameter
     */
    value: TData;

    /**
     * Key/name of parameter
     */
    key: string;
}