import {RestDateApi} from '@anglr/rest';
import {isDate} from '@jscrpt/common';
import {format, isBefore} from 'date-fns';

/**
 * RestDateApi implementation using date-fns
 */
export class DateFnsRestDateApi implements RestDateApi<Date>
{
    /**
     * @inheritdoc
     */
    public isDate(value: any): value is Date
    {
        return isDate(value);
    }

    /**
     * @inheritdoc
     */
    public toString(value: Date): string
    {
        return format(value, 'yyyy-MM-dd');
    }

    /**
     * @inheritdoc
     */
    public isBeforeNow(tested: Date): boolean
    {
        return isBefore(tested, new Date());
    }
}