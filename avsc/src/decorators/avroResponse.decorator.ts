import {RESTClient, RestMethodMiddlewares} from '@anglr/rest';

/**
 * Enables AVRO encoding for response object received in body
 * @param namespace - Name of namespace in which is type defined
 * @param typeName - Name of type that should be used
 */
export function AvroResponse(namespace: string, typeName: string)
{
    return function(_target: RESTClient, _propertyKey: string, descriptor: RestMethodMiddlewares): TypedPropertyDescriptor<any>
    {

        //TODO: finish, create middleware used for handling data

        // descriptor.additionalInfo.avroResponse =
        // {
        //     name: typeName,
        //     namespace: namespace
        // };

        console.log(namespace, typeName);

        return descriptor;
    };
}