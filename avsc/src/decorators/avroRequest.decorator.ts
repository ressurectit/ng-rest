import {RESTClient, AdditionalInfoPropertyDescriptor, RestMethodMiddlewares, AdditionalDataMiddleware} from '@anglr/rest';

import {AvroRequestType} from '../avsc';

/**
 * Enables AVRO encoding for request object sent in body
 * @param namespace - Name of namespace in which is type defined
 * @param typeName - Name of type that should be used
 */
export function AvroRequest(namespace: string, typeName: string)
{
    return function(_target: RESTClient, _propertyKey: string, descriptor: AdditionalInfoPropertyDescriptor<AvroRequestType> &
                                                                           RestMethodMiddlewares)
    {
        descriptor.additionalInfo = descriptor.additionalInfo ?? {};
        descriptor.middlewareTypes.push(AdditionalDataMiddleware);
        descriptor.additionalInfo.avroRequest =
        {
            name: typeName,
            namespace: namespace
        };

        return descriptor;
    };
}