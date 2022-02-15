import {RestDateApi} from '@anglr/rest';
import {isDate} from '@jscrpt/common';
import {format} from 'date-fns';

/**
 * RestDateApi implementation using date-fns
 */
export class DateFnsRestDateApi implements RestDateApi<Date>
{
    /**
     * Tests whether provided value is date
     * @param value - Value to be tested
     */
    public isDate(value: any): value is Date
    {
        return isDate(value);
    }

    /**
     * Serialize date into string representation of date
     * @param value - Value to be serialized
     */
    public toString(value: Date): string
    {
        return format(value, 'yyyy-MM-dd');
    }
}