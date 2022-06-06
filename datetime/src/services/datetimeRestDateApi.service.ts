import {Inject, Injectable} from '@angular/core';
import {RestDateApi} from '@anglr/rest';
import {DateApi, DATE_API} from '@anglr/datetime';

/**
 * RestDateApi implementation using `@anglr/datetime`
 */
@Injectable()
export class DatetimeRestDateApi<TDate = any> implements RestDateApi<TDate>
{
    //######################### constructor #########################
    constructor(@Inject(DATE_API) protected _dateApi: DateApi<TDate>)
    {
    }

    //######################### public methods #########################

    /**
     * @inheritdoc
     */
    public isDate(value: any): value is TDate|Date
    {
        return this._dateApi.isDate(value);
    }

    /**
     * @inheritdoc
     */
    public toString(value: TDate|Date): string
    {
        return this._dateApi.getValue(value).format('yyyy-MM-dd');
    }

    /**
     * @inheritdoc
     */
    public isBeforeNow(tested: TDate): boolean
    {
        return this._dateApi.now().isAfter(tested);
    }
}