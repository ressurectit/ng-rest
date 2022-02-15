/**
 * Set the base URL of REST resource
 * @param url - base URL
 */
export function BaseUrl(url: string): ClassDecorator
{
    return function<TFunction extends Function> (Target: TFunction): TFunction
    {
        Target.prototype.getBaseUrl = function()
        {
            return url;
        };

        return Target;
    };
}