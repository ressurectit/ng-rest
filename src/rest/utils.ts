import {Type} from '@angular/core';

import {RestMiddleware, RestMiddlewareRunMethod} from './rest.interface';

/**
 * Builds and returns array of middleware run functions
 * @param middlewares - Array of set middleware types
 * @param middlewaresOrder - Array of middleware types in order that should be executed
 */
export function buildMiddlewares(middlewares: Type<RestMiddleware>[],
                                 middlewaresOrder: Type<RestMiddleware>[]): RestMiddlewareRunMethod[]
{
    let usedMiddlewares: Type<RestMiddleware>[] = [];

    middlewares.forEach(middleware =>
    {
        let index = middlewaresOrder.indexOf(middleware);

        //middleware does not have defined order
        if(index < 0)
        {
            return;
        }

        usedMiddlewares[index] = middleware;
    });

    let runMethods: RestMiddlewareRunMethod[] = [];

    usedMiddlewares.forEach(middleware =>
    {
        runMethods.push(new middleware().run);
    });

    return runMethods;
}