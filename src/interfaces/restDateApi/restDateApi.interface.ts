/**
 * Definition of RestDateApi used for testing whether value is date and for serialization
 */
export interface RestDateApi<TDate = unknown>
{
    /**
     * Tests whether provided value is date
     * @param value - Value to be tested
     */
    isDate(value: unknown): value is TDate|Date;

    /**
     * Serialize date into string representation of date
     * @param value - Value to be serialized
     */
    toString(value: TDate|Date): string;

    /**
     * Tests whether tested date is before now
     * @param tested - Tested date
     */
    isBeforeNow(tested: TDate): boolean;
}
