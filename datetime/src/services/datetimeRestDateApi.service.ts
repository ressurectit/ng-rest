import {Inject, Injectable} from '@angular/core';
import {RestDateApi} from '@anglr/rest';
import {DateApi, DATE_API} from '@anglr/datetime';

import {DATETIME_STRING_FORMAT} from '../misc/tokens';

/**
 * RestDateApi implementation using `@anglr/datetime`
 */
@Injectable()
export class DatetimeRestDateApi<TDate = unknown> implements RestDateApi<TDate>
{
    //######################### constructor #########################
    constructor(@Inject(DATE_API) protected dateApi: DateApi<TDate>,
                @Inject(DATETIME_STRING_FORMAT) protected stringFormat: string,)
    {
    }

    //######################### public methods #########################

    /**
     * @inheritdoc
     */
    public isDate(value: unknown): value is TDate|Date
    {
        return this.dateApi.isDate(value);
    }

    /**
     * @inheritdoc
     */
    public toString(value: TDate|Date): string
    {
        return this.dateApi.getValue(value).format(this.stringFormat);
    }

    /**
     * @inheritdoc
     */
    public isBeforeNow(tested: TDate): boolean
    {
        return this.dateApi.now().isAfter(tested);
    }
}