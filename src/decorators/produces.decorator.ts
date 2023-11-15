import type {RESTClient} from '../rest/common';
import {RestResponseType, RestMethodMiddlewares} from '../rest/rest.interface';
import {ResponseType} from '../rest/responseType';
import {ProducesMiddleware} from '../middlewares';

/**
 * Defines the response type(s) that the methods can produce or tzpe of body id full request or events are requested
 * @param producesDef - response type to be produced
 */
export function Produces(producesDef: ResponseType)
{
    return function<TDecorated>(_target: RESTClient, _propertyKey: string, descriptor: RestResponseType &
                                                                                       RestMethodMiddlewares |
                                                                                       TDecorated): TypedPropertyDescriptor<any>
    {
        const descr = descriptor as RestResponseType & RestMethodMiddlewares;

        descr.responseType = producesDef;
        descr.middlewareTypes?.push(ProducesMiddleware);

        return descr;
    };
}