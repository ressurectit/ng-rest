import {RESTClient} from '../common';
import {RestResponseType} from '../rest.interface';
import {ResponseType} from '../responseType';

/**
 * Defines the response type(s) that the methods can produce or tzpe of body id full request or events are requested
 * @param producesDef - response type to be produced
 */
export function Produces(producesDef: ResponseType)
{
    return function(_target: RESTClient, _propertyKey: string, descriptor: RestResponseType)
    {
        descriptor.responseType = producesDef;

        return descriptor;
    };
}