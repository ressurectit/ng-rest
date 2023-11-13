import {ClassProvider, EnvironmentProviders, Provider, ValueProvider, makeEnvironmentProviders} from '@angular/core';
import {REST_DATE_API} from '@anglr/rest';

import {DatetimeRestDateApi} from '../services/datetimeRestDateApi.service';
import {DATETIME_STRING_FORMAT} from './tokens';

/**
 * Provides rest date api using `@anglr/datetime`
 */
export function provideRestDateTime(): EnvironmentProviders
{
    return makeEnvironmentProviders(
    [
        <ClassProvider>
        {
            provide: REST_DATE_API,
            useClass: DatetimeRestDateApi,
        },
        provideRestDateTimeStringFormat('yyyy-MM-dd')
    ]);
}

/**
 * Provides rest date time string format
 * @param format - Date time format
 */
export function provideRestDateTimeStringFormat(format: string): Provider
{
    return <ValueProvider>{
        provide: DATETIME_STRING_FORMAT,
        useValue: format,
    };
}