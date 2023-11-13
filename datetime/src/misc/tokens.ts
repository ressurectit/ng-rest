import {ClassProvider, InjectionToken} from '@angular/core';
import {REST_DATE_API} from '@anglr/rest';

import {DatetimeRestDateApi} from '../services/datetimeRestDateApi.service';

/**
 * Provider for RestDateApi using datetime
 */
export const DATETIME_REST_DATE_API: ClassProvider =
{
    provide: REST_DATE_API,
    useClass: DatetimeRestDateApi,
};

/**
 * Injection token for datetime string format
 */
export const DATETIME_STRING_FORMAT: InjectionToken<string> = new InjectionToken<string>('DATETIME_STRING_FORMAT');
    