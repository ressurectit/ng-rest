import {ResponseType} from '../../../misc/enums';

/**
 * Contains response type that will be set
 */
export interface RestResponseType extends TypedPropertyDescriptor<unknown>
{
    /**
     * Response type to be set
     */
    responseType?: ResponseType;
}
