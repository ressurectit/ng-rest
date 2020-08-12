import {RESTClient} from '../common';
import {RestReportProgress} from '../rest.interface';

/**
 * Allows method to report full progress events
 */
export function ReportProgress()
{
    return function(_target: RESTClient, _propertyKey: string, descriptor: RestReportProgress)
    {
        descriptor.reportProgress = true;

        return descriptor;
    };
}