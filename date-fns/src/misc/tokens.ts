import {ClassProvider} from '@angular/core';
import {REST_DATE_API} from '@anglr/rest';

import {DateFnsRestDateApi} from '../services/dateFnsRestDateApi.service';

/**
 * Provider for RestDateApi using date-fns
 */
export const DATE_FNS_REST_DATE_API: ClassProvider =
{
    provide: REST_DATE_API,
    useClass: DateFnsRestDateApi
};