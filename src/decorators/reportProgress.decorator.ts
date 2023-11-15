import {not} from '../misc/utils';
import {ResponseTypeMiddleware} from '../middlewares/responseType.middleware';
import type {RESTClientBase} from '../misc/classes/restClientBase';
import {RestMethodMiddlewares, RestReportProgress} from '../interfaces';

/**
 * Allows method to report full progress events
 */
export function ReportProgress()
{
    return function<TDecorated>(_target: RESTClientBase, _propertyKey: string, descriptor: RestReportProgress &
                                                                                           RestMethodMiddlewares |
                                                                                           TDecorated): TDecorated
    {
        const descr = descriptor as RestReportProgress & RestMethodMiddlewares;

        descr.reportProgress = true;
        descr.middlewareTypes.push(not(ResponseTypeMiddleware));

        return descr as TDecorated;
    };
}