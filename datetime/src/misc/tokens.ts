import {ClassProvider} from '@angular/core';
import {REST_DATE_API} from '@anglr/rest';

import {DatetimeRestDateApi} from '../services/datetimeRestDateApi.service';

/**
 * Provider for RestDateApi using datetime
 */
export const DATETIME_REST_DATE_API: ClassProvider =
{
    provide: REST_DATE_API,
    useClass: DatetimeRestDateApi
};