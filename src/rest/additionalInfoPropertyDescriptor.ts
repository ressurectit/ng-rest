import {AdditionalInfo} from '@anglr/common';

/**
 * Property descriptor that is used for creating decorators that can pass additional info to method
 */
export interface AdditionalInfoPropertyDescriptor<TAdditional = any> extends TypedPropertyDescriptor<any>, AdditionalInfo<TAdditional>
{
}