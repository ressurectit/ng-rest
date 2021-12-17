/**
 * Set default headers for every method of the RESTClient
 * @param headers - deafult headers in a key-value pair
 */
export function DefaultHeaders(headers: {[key: string]: string}): ClassDecorator
{
    return function<TFunction extends Function> (Target: TFunction): TFunction
    {
        Target.prototype.getDefaultHeaders = function()
        {
            return headers;
        };

        return Target;
    };
}