import {ResponseTransformFunc} from '../../responseTransform/responseTransform.interface';

/**
 * Contains response transform function to be called
 */
export interface RestResponseTransform extends TypedPropertyDescriptor<unknown>
{
    /**
     * Response transform function
     */
    responseTransform: ResponseTransformFunc;
}