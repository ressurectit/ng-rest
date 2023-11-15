import {StringDictionary} from '@jscrpt/common';

/**
 * Contains additional headers that will be added
 */
export interface RestHttpHeaders extends TypedPropertyDescriptor<unknown>
{
    /**
     * Headers defintion to be added
     */
    headers: StringDictionary;
}
