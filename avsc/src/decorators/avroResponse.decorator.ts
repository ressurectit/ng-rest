import {RESTClient, AdditionalInfoPropertyDescriptor} from '@anglr/rest';

import {AvroResponseType} from '../avsc';

/**
 * Enables AVRO encoding for response object received in body
 * @param namespace - Name of namespace in which is type defined
 * @param typeName - Name of type that should be used
 */
export function AvroResponse(namespace: string, typeName: string)
{
    return function(_target: RESTClient, _propertyKey: string, descriptor: AdditionalInfoPropertyDescriptor<AvroResponseType>)
    {
        if(!descriptor.additionalInfo)
        {
            descriptor.additionalInfo = {};
        }

        descriptor.additionalInfo.avroResponse =
        {
            name: typeName,
            namespace: namespace
        };

        return descriptor;
    };
}