/**
 * Defines AVRO request definition
 */
export interface AvroRequestObj
{
    /**
     * Name of namespace where is type defined
     */
    namespace: string;
    
    /**
     * Name of type that is used
     */
    name: string;
}

/**
 * Defines AVRO response definition
 */
export interface AvroResponseObj extends AvroRequestObj
{
}
