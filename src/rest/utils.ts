import {Type} from '@angular/core';

import {RestMiddleware, RestMiddlewareRunMethod, NotType} from './rest.interface';

/**
 * Builds and returns array of middleware run functions
 * @param middlewares - Array of set middleware types
 * @param middlewaresOrder - Array of middleware types in order that should be executed
 */
export function buildMiddlewares(middlewares: Type<RestMiddleware>[],
                                 middlewaresOrder: Type<RestMiddleware>[]): RestMiddlewareRunMethod[]
{
    let usedMiddlewares: Type<RestMiddleware>[] = [];

    middlewares
        .filter(middleware => !isNotType(middleware))
        .forEach(middleware =>
        {
            let type: Type<RestMiddleware> = getType(middleware);
            let index = middlewaresOrder.indexOf(type);

            //middleware does not have defined order
            if(index < 0)
            {
                return;
            }

            usedMiddlewares[index] = type;
        });

    //removes not middlewares
    middlewares
        .filter(middleware => isNotType(middleware))
        .forEach(middleware =>
        {
            let type: Type<RestMiddleware> = getType(middleware);
            let index = usedMiddlewares.indexOf(type);

            if(index < 0)
            {
                return;
            }

            usedMiddlewares.splice(index, 1);
        });

    let runMethods: RestMiddlewareRunMethod[] = [];

    usedMiddlewares.forEach(middleware =>
    {
        runMethods.push(new middleware().run);
    });

    return runMethods;
}

/**
 * Creates NotType from Type, this type will be removed from middlewares
 * @param type - Type that will be set as NotType
 */
export function not(type: Type<RestMiddleware>): Type<RestMiddleware>
{
    return new NotType<RestMiddleware>(type) as any;
}

/**
 * Gets underlying type for Type and NotType
 * @param type - Type that is going to be used for extraction
 */
export function getType<TType>(type: Type<TType>): Type<TType>
{
    if(type instanceof NotType)
    {
        return type.ɵtype;
    }

    return type;
}

/**
 * Tests whether is provided type NotType
 * @param type - Type to be tested for NotType
 */
export function isNotType<TType>(type: Type<TType>): boolean
{
    return type instanceof NotType;
}