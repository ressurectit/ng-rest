import {RestMiddleware, RestMiddlewareRunMethod, NotType, BuildMiddlewaresFn, RestMiddlewareType, RestMiddlewareOrderType} from './rest.interface';

/**
 * Builds and returns array of middleware run functions
 * @param middlewares - Array of set middleware types
 * @param middlewaresOrder - Array of middleware types in order that should be executed
 */
export const buildMiddlewares: BuildMiddlewaresFn = function buildMiddlewares(middlewares: RestMiddlewareType<RestMiddleware>[],
                                                                              middlewaresOrder: RestMiddlewareOrderType<string>[]): RestMiddlewareRunMethod[]
{
    const usedMiddlewares: RestMiddlewareType<RestMiddleware>[] = [];

    middlewares
        .filter(middleware => !isNotType(middleware))
        .forEach(middleware =>
        {
            const type: RestMiddlewareType<RestMiddleware> = getType(middleware);
            const index = middlewaresOrder.findIndex(itm => itm == type || type.id == itm);

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
            const type: RestMiddlewareType<RestMiddleware> = getType(middleware);
            const index = middlewaresOrder.findIndex(itm => itm == type || type.id == itm);

            if(index < 0)
            {
                return;
            }

            usedMiddlewares.splice(index, 1);
        });

    const runMethods: RestMiddlewareRunMethod[] = [];

    usedMiddlewares.forEach(middleware =>
    {
        runMethods.push(new middleware().run);
    });

    return runMethods;
};

/**
 * Creates NotType from Type, this type will be removed from middlewares
 * @param type - Type that will be set as NotType
 */
export function not(type: RestMiddlewareType<RestMiddleware>): RestMiddlewareType<RestMiddleware>
{
    return new NotType<RestMiddleware>(type) as unknown as RestMiddlewareType<RestMiddleware>;
}

/**
 * Gets underlying type for Type and NotType
 * @param type - Type that is going to be used for extraction
 */
export function getType<TType extends RestMiddleware>(type: RestMiddlewareType<TType>): RestMiddlewareType<TType>
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
export function isNotType<TType extends RestMiddleware>(type: RestMiddlewareType<TType>): boolean
{
    return type instanceof NotType;
}