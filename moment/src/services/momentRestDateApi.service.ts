import {RestDateApi} from '@anglr/rest';
import {isDate} from '@jscrpt/common';
import moment from 'moment';

/**
 * RestDateApi implementation using moment js
 */
export class MomentRestDateApi implements RestDateApi<moment.Moment>
{
    /**
     * Tests whether provided value is date
     * @param value - Value to be tested
     */
    public isDate(value: any): value is moment.Moment|Date
    {
        return isDate(value) || (value instanceof moment);
    }

    /**
     * Serialize date into string representation of date
     * @param value - Value to be serialized
     */
    public toString(value: moment.Moment|Date): string
    {
        return moment(value).format('YYYY-MM-DD');
    }
}