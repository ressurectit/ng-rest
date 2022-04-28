import {RestDateApi} from '@anglr/rest';
import {isDate} from '@jscrpt/common';
import moment from 'moment';

/**
 * RestDateApi implementation using moment js
 */
export class MomentRestDateApi implements RestDateApi<moment.Moment>
{
    /**
     * @inheritdoc
     */
    public isDate(value: any): value is moment.Moment|Date
    {
        return isDate(value) || (value instanceof moment);
    }

    /**
     * @inheritdoc
     */
    public toString(value: moment.Moment|Date): string
    {
        return moment(value).format('YYYY-MM-DD');
    }

    /**
     * @inheritdoc
     */
    public isBeforeNow(tested: moment.Moment): boolean
    {
        return tested.isBefore(moment());
    }
}