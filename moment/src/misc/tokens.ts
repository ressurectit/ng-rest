import {ClassProvider} from '@angular/core';
import {REST_DATE_API} from '@anglr/rest';

import {MomentRestDateApi} from '../services/momentRestDateApi.service';

/**
 * Provider for RestDateApi using moment js
 */
export const MOMENT_REST_DATE_API: ClassProvider =
{
    provide: REST_DATE_API,
    useClass: MomentRestDateApi
};