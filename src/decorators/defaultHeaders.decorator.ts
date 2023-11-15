import {StringDictionary} from '@jscrpt/common';

/**
 * Set default headers for every method of the RESTClient
 * @param headers - deafult headers in a key-value pair
 */
export function DefaultHeaders(headers: StringDictionary): ClassDecorator
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