import type {RESTClient} from '../common';
import {RestReportProgress, RestMethodMiddlewares} from '../rest.interface';
import {not} from '../utils';
import {ResponseTypeMiddleware} from '../middlewares/responseType.middleware';

/**
 * Allows method to report full progress events
 */
export function ReportProgress()
{
    return function<TDecorated>(_target: RESTClient, _propertyKey: string, descriptor: RestReportProgress &
                                                                                       RestMethodMiddlewares |
                                                                                       TDecorated): TypedPropertyDescriptor<any>
    {
        const descr = descriptor as RestReportProgress & RestMethodMiddlewares;

        descr.reportProgress = true;
        descr.middlewareTypes?.push(not(ResponseTypeMiddleware));

        return descr;
    };
}