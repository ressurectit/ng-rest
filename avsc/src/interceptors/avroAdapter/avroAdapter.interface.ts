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

/**
 * Contains name of AVRO type for request
 */
export interface AvroRequestType 
{
    /**
     * Name of avro request type
     */
    avroRequest?: AvroRequestObj;
}

/**
 * Contains name of AVRO type for response
 */
export interface AvroResponseType 
{
    /**
     * Name of avro response type
     */
    avroResponse?: AvroResponseObj;
}