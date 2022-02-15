import {RESTClient} from '../common';
import {RestResponseType, RestMethodMiddlewares} from '../rest.interface';
import {ResponseType} from '../responseType';
import {ProducesMiddleware} from '../middlewares';

/**
 * Defines the response type(s) that the methods can produce or tzpe of body id full request or events are requested
 * @param producesDef - response type to be produced
 */
export function Produces(producesDef: ResponseType)
{
    return function(_target: RESTClient, _propertyKey: string, descriptor: RestResponseType &
                                                                           RestMethodMiddlewares)
    {
        descriptor.responseType = producesDef;
        descriptor.middlewareTypes.push(ProducesMiddleware);

        return descriptor;
    };
}