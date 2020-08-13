import {RESTClient} from '../common';
import {RestReportProgress, RestMethodMiddlewares} from '../rest.interface';
import {not} from '../utils';
import {ResponseTypeMiddleware} from '../middlewares/responseType.middleware';

/**
 * Allows method to report full progress events
 */
export function ReportProgress()
{
    return function(_target: RESTClient, _propertyKey: string, descriptor: RestReportProgress &
                                                                           RestMethodMiddlewares)
    {
        descriptor.reportProgress = true;
        descriptor.middlewareTypes.push(not(ResponseTypeMiddleware));

        return descriptor;
    };
}