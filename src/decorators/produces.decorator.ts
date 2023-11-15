import {RestMethodMiddlewares, RestResponseType} from '../interfaces';
import {ProducesMiddleware} from '../middlewares';
import type {RESTClientBase} from '../misc/classes/restClientBase';
import {ResponseType} from '../misc/enums';

/**
 * Defines the response type(s) that the methods can produce or tzpe of body id full request or events are requested
 * @param producesDef - response type to be produced
 */
export function Produces(producesDef: ResponseType)
{
    return function<TDecorated>(_target: RESTClientBase, _propertyKey: string, descriptor: RestResponseType &
                                                                                           RestMethodMiddlewares |
                                                                                           TDecorated): TDecorated
    {
        const descr = descriptor as RestResponseType & RestMethodMiddlewares;

        descr.responseType = producesDef;
        descr.middlewareTypes.push(ProducesMiddleware);

        return descr as TDecorated;
    };
}