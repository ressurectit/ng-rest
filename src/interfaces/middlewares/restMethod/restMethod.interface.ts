/**
 * Contains data that are stored when REST method is set
 */
export interface RestMethod extends TypedPropertyDescriptor<unknown>
{
    /**
     * Number of parameters that are on the method originaly
     */
    originalParamsCount: number;
}
