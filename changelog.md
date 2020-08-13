# Changelog

## Version 8.0.0 (2020-08-13)

### Features

- added *subpackage* `@anglr/rest/avsc`
- package `@anglr/rest/avsc`
    - you need to have avro schemas available to make it working
    - added new `AvroAdapterSchemaProvider` service interface for obtaining AVRO schemas
    - added new `AVRO_ADAPTER_SCHEMA_PROVIDER` *injection token* for obtaining `AvroAdapterSchemaProvider` with default provider set to dummy `NoAvroAdapterSchemaProviderService`
    - added new `AvroRequest` decorator which enables AVRO processing of request (requires `AvroAdapterInterceptor` to work)
    - added new `AvroResponse` decorator which enables AVRO processing of response (requires `AvroAdapterInterceptor` to work)
    - added new `AvroAdapterInterceptorOptions` which provides options for `AvroAdapterInterceptor`
        - `disabled` - indication whether this interceptor is disabled
        - `fingerprintHeaderName` - name of header used for passing fingerprint of schema
        - `typeHeaderName` - name of header used for passing name of type
        - `customAcceptContentTypeHeader` - value passed to custom Accept header and Content-Type header
    - added new `AvroRequestType`, `AvroResponseType`, `AvroRequestObj`, `AvroResponseObj` interfaces which enables easier definition of *additional data* available in interceptor
    - added new `AvroAdapterInterceptor` interceptor, which allows AVRO request and response processing, it works together with `AvroRequest`, `AvroResponse` decorators which tells this interceptor that request or response should be processed and provides information about type
- added new `AdditionalInfoPropertyDescriptor`, which allows definition of decorator that will fill `additionalInfo`
- added new types that are used for helping working with metadata stored in *Descriptor*
    - `RestHttpHeaders` - contains additional headers that will be added
    - `RestResponseType` - contains response type that will be set
    - `RestResponseTransform` - contains response transform function to be called
    - `RestDisabledInterceptors` - contains array of interceptor types that will be disabled
    - `RestReportProgress` - contains indication whether report progress
    - `RestFullHttpResponse` - contains indication whether is response full HttpResponse or just data
    - `RestMethod` - contains data that are stored when REST method is set
    - `RestCaching` - contains methods used for handling 'caching'
    - `KeyIndex` - information about parameter key and index
    - `ParametersMetadata` - metadata for parameters
    - `ParametersTransformMetadata` - contains parameters metadata for each decorated method parameters transforms
    - `RestParameters` - contains parameters metadata for each decorated method parameters
    - `RestMethodMiddlewares` - contains rest middleware types that will be used, decorator can add type if it wish to be used
- added new `ProgressIndicatorGroup` decorator, which allows definition of progress indicator group name for service
- added new constants for *Http Header* names
    - `HTTP_HEADER_CONTENT_TYPE` for *Content-Type* header
    - `HTTP_HEADER_ACCEPT` for *Accept* header
- added new `REST_METHOD_MIDDLEWARES` injection token used for injecting array of rest middleware types that defines order of rest middlewares
- added new `REST_MIDDLEWARES_ORDER` injection token used for injecting array of rest middleware types that are default for each rest method
- added new `BASIC_DEFAULT_REST_METHOD_MIDDLEWARES` constant with basic default array of rest middlewares order
- added new `BASIC_DEFAULT_REST_MIDDLEWARES_ORDER` constant with basic defaut array of rest middlewares used for each rest method
- added new `RestMiddleware` interface, that is used for definition of *rest middleware* classes, that are used for building request and processing response
- added new `RestMiddlewareRunMethod` interface, that defines run method signature for *rest middleware*
- added new `ɵRESTClient` interface, which has definition of *private* members of `RESTClient` and makes them available in decorators
- added middlewares to process request and response
    - `ReportProgressMiddleware` - middleware that is used for handling report progress setting, if not set returns only final http response with data

### BREAKING CHANGES

- minimal supported version of *Angular* is `10.0.0`
- minimal supported version of `@jscrpt/common` is `1.2.0`
- minimal supported version of `@anglr/common` is `8.0.0`
- minimal supported version of `crypto-js` is `4.0.0`
- changed response type for `getDefaultHeaders` method of `RESTClient`
- completely refactored library and how it works

## Version 7.0.1

- package `@anglr/rest/stompjs`
    - fixed problem with missing default timeout, now 30 seconds
    - set transport layer only to *websocket*

## Version 7.0.0

- updated to latest stable *Angular* 9
- added generating of API doc

## Version 6.1.1

 - fixed compilation `aot` error

## Version 6.1.0

 - added support for WebSockets using *StompJs* using `@anglr/rest/stompjs`

## Version 6.0.2

 - correctly fixed ignored interceptors with same request at same time multiple times

## Version 6.0.1

 - fixed ignored interceptors with same request at same time multiple times

## Version 6.0.0

 - Angular IVY ready (APF compliant package)
 - added support for ES2015 compilation
 - Angular 8

## Version 5.0.0
 - stabilized for angular v6

## Version 5.0.0-beta.3
 - removed `RestTransferStateModule`, `RestTransferStateService` is injected using `Injectable`

## Version 5.0.0-beta.2
 - `RestTransferStateService` is now *tree-shakeable*
 - `@anglr/rest` is now marked as *sideEffects* free

## Version 5.0.0-beta.1
 - aktualizácia balíčkov `Angular` na `6`
 - aktualizácia `Webpack` na verziu `4`
 - aktualizácia `rxjs` na verziu `6`
 - automatické generovanie dokumentácie

## Version 4.0.14
- updated `ResponseTransform` now should correctly set `this` to transform method

## Version 4.0.13
- updated usage of `IgnoredInterceptorsService`, now using correctly `requestId`

## Version 4.0.12
- now setting ignore interceptor also with `urlWithParams`

## Version 4.0.11
- added support for `DisableInterceptor` decorator, which allows for specified method disable specified type of http client interceptor

## Version 4.0.10
- added support for `ParameterTransform` for `@Body` parameter

## Version 4.0.9
- added new response type `BlobAndFilename`
- fixed @angular dependencies
- fixed `Query` decorator for parameters with empty value

## Version 4.0.8
- `QueryObject` decorator for parameters now correctly supports array of objects as property value

## Version 4.0.7
 - removed `TransferStateService`
 - added wrapper `RestTransferStateService` for angulars `TransferState`
 - now using angulars `TransferState` for SSR

## Version 4.0.6
 - fixed obtaining `id` from `LocationHeader` response type

## Version 4.0.5
 - fixed obtaining `LocationHeader` response type

## Version 4.0.4
 - fixed default response type to 'json'

## Version 4.0.3
 - fixed processing of headers and http params

## Version 4.0.2
 - returned typescript version back to 2.4.2 and removed distJit

## Version 4.0.1
 - added compiled outputs for Angular JIT

## Version 4.0.0
 - updated angular to 5.0.0 (final)
 - changed dependencies of project to peerDependencies
 - more strict compilation
 - updated usage of rxjs, now using operators

## Version 4.0.0-beta.1
 - updated angular to >=5.0.0-rc.7

## Version 4.0.0-beta.0
 - removed dependency from `@angular/http`
 - using `HttpClient` instead of `Http`