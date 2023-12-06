# Changelog

## Version 14.0.0 (2023-12-06)

### Bug Fixes

- fixed `buildMiddlewares`, now correctly removes middlewares in case of multiple ignored middlewares (worked only with 1 ignored middleware before)

### Features

- new `provideRestMiddlewaresOrder` function, that provides rest middlewares execution order
- new `provideRestMethodMiddlewares` function, that provides middleware types for rest http method, executed each time
- new `provideRestDateApi` function, that provides rest date api type
- new `provideMockLogger` function, that provides mock logger
- new `RESTClientBase` class, that is base class for RESTClient class
    - **properties**
        - `http` instance of http client
        - `injector` instance of injector used for obtaining DI
        - `middlewaresOrder` array of rest middlewares in specific order in which will be middlewares executed
        - `methodMiddlewares` array of middlewares that are executed for each http method
        - `baseUrl` base path that is prepended to request URL
    - **methods**
        - `getBaseUrl` returns the base url of RESTClient
        - `getDefaultHeaders` returns the default headers of RESTClient in a key-value
        - `requestInterceptor` request interceptor for all methods, must return new HttpRequest since object is immutable
        - `responseInterceptor` allows to intercept all responses for all methods in class
- new `RestHttpMethod` interface, that contains data that are stored when REST method is set
- new `RestMiddlewareRunNextMethod` interface, that is definition of method that is used for passing execution to the next middleware
- updated `ParameterTransformFunc` interface, now supports async parameter transformation
- updated `handleQueryParam` function
    - is now `async`
- updated `handleHeaderParam` function
    - is now `async`
- updated `handlePathParam` function
    - is now `async`
- updated `handleQueryObjectParam` function
    - is now `async`
- subpackage `@anglr/rest/datetime`
    - new `provideRestDateTime` function, that provides rest date api using `@anglr/datetime`
    - new `provideRestDateTimeStringFormat` function, that provides rest date time string format
    - new `DATETIME_STRING_FORMAT` injection token for datetime string format

### BREAKING CHANGES

- minimal supported version of `NodeJs` is `18`
- minimal supported version of `@angular` is `17.0.1`
- minimal supported version of `rxjs` is `7.5.7`
- minimal supported version of `@jscrpt/common` is `5.0.0`
- minimal supported version of `@anglr/common` is `19.0.0`
- minimal supported version of `@anglr/datetime` is `7.0.0`
- minimal supported version of `tslib` is `2.6.3`
- removed `RestTransferStateService` service, Angular has native support for this
- updated `RESTClient` service,
    - now has constructor with no parameters
- subpackage `@anglr/rest/datetime`
    - removed `DATETIME_REST_DATE_API` injection token, use `provideRestDateTime`

## Version 13.0.1 (2023-07-25)

### Bug Fixes

- fixed `DisableMiddleware` imports, which points to itself

## Version 13.0.0 (2023-05-17)

### Features

- updated `ParameterTransformFunc` interface
    - added new parameter `args`, used for passing all arguments from method
- updated `HeaderParameterMiddleware` middleware
    - updated to use new `handleHeaderParam` function and to pass parameters args to transform function
- updated `PathParameterMiddleware` middleware
    - updated to use new `handlePathParam` function and to pass parameters args to transform function
- updated `QueryObjectParameterMiddleware` middleware
    - updated to use new `handleQueryObjectParam` function and to pass parameters args to transform function
- updated `QueryParameterMiddleware` middleware
    - updated to use new `handleQueryParam` function and to pass parameters args to transform function
- updated `BodyParameterMiddleware` middleware
    - updated to pass parameters args to transform function
- updated `ParameterTransform` decorator
    - now passes args to transform functions

### BREAKING CHANGES

- updated `handleQueryParam` function
    - now requires 3rd parameter `args`, which contains all arguments passed to method
- updated `handleHeaderParam` function
    - now requires 3rd parameter `args`, which contains all arguments passed to method
- updated `handlePathParam` function
    - now requires 3rd parameter `args`, which contains all arguments passed to method
- updated `handleQueryObjectParam` function
    - now requires 4th parameter `args`, which contains all arguments passed to method

## Version 12.1.4 (2022-10-14)

### Bug Fixes

- fixed `ParamsDataIterator` optional parameters are only with `undefined` value, `null` value is not considered optional
- fixed `handleQueryParam`, now skips optional parameters (`undefined` and `null`)
- fixed `handleHeaderParam`, now skips optional parameters (`undefined` and `null`)
- fixed `handlePathParam`, optional parameters (`undefined` and `null`) are replaced by empty string

## Version 12.1.3 (2022-10-10)

### Bug Fixes

- fixed default value for `CorrelationBodyProperty` in `WebSocketClient`

## Version 12.1.2 (2022-09-21)

### Bug Fixes

- fixed problem with `null` or `undefined` parameters at start of params array in `ParamsDataIterator`

## Version 12.1.1 (2022-09-14)

### Bug Fixes

- fixed problem with missing transforms and getting param data from index out of array in `ParamsDataIterator`

## Version 12.1.0 (2022-09-09)

### Features

- new `ParamsDataIterator` class, that is iterator for params data
- new `ParamsDataIteratorItem` interface, that represents item during iteration of params data
- new `handleQueryParam` function, that handles query param and fills params dictionary
- new `handleHeaderParam` function, that handles header param and fills headers dictionary
- new `handlePathParam` function, that handles path param and return updated url
- new `handleQueryObjectParam` function, that handles query object param and fills serialized query string array
- new `mergeQueryObjectParamsWithHttpParams` function, that merges serialized query objects data with existing http params

## Version 12.0.0 (2022-06-08)

### Features

- all middlewares are now *treeshakeable* if not used
- new `middlewareTypes` type, that contains array of middleware names that are built-in
- new `RestMiddlewareType` type, that represents definition of type that implements `RestMiddleware`
- new `RestMiddlewareOrderType` type, that represents definition of type that is used for definition of order of middlewares
- updated `BASIC_DEFAULT_REST_MIDDLEWARES_ORDER` constant
    - now is treeshakable
    - contains all built-in middlewares
    - now is of type `RestMiddlewareOrderType[]`
- updated `REST_MIDDLEWARES_ORDER` injection token
    - now injects type `RestMiddlewareOrderType[]`
- updated `AdvancedCacheMiddleware` middleware, now middleware type has *static* `id` to correspond with `RestMiddlewareType<RestMiddleware>`
- updated `BodyParameterMiddleware` middleware, now middleware type has *static* `id` to correspond with `RestMiddlewareType<RestMiddleware>`
- updated `CacheMiddleware` middleware, now middleware type has *static* `id` to correspond with `RestMiddlewareType<RestMiddleware>`
- updated `ClearAdvancedCacheMiddleware` middleware, now middleware type has *static* `id` to correspond with `RestMiddlewareType<RestMiddleware>`
- updated `HeaderParameterMiddleware` middleware, now middleware type has *static* `id` to correspond with `RestMiddlewareType<RestMiddleware>`
- updated `HeadersMiddleware` middleware, now middleware type has *static* `id` to correspond with `RestMiddlewareType<RestMiddleware>`
- updated `IgnoredInterceptorsMiddleware` middleware, now middleware type has *static* `id` to correspond with `RestMiddlewareType<RestMiddleware>`
- updated `LoggerMiddleware` middleware, now middleware type has *static* `id` to correspond with `RestMiddlewareType<RestMiddleware>`
- updated `MockLoggerMiddleware` middleware, now middleware type has *static* `id` to correspond with `RestMiddlewareType<RestMiddleware>`
- updated `PathParameterMiddleware` middleware, now middleware type has *static* `id` to correspond with `RestMiddlewareType<RestMiddleware>`
- updated `ProducesMiddleware` middleware, now middleware type has *static* `id` to correspond with `RestMiddlewareType<RestMiddleware>`
- updated `ProgressIndicatorGroupMiddleware` middleware, now middleware type has *static* `id` to correspond with `RestMiddlewareType<RestMiddleware>`
- updated `QueryObjectParameterMiddleware` middleware, now middleware type has *static* `id` to correspond with `RestMiddlewareType<RestMiddleware>`
- updated `QueryParameterMiddleware` middleware, now middleware type has *static* `id` to correspond with `RestMiddlewareType<RestMiddleware>`
- updated `ReportProgressMiddleware` middleware, now middleware type has *static* `id` to correspond with `RestMiddlewareType<RestMiddleware>`
- updated `ResponseTransformMiddleware` middleware, now middleware type has *static* `id` to correspond with `RestMiddlewareType<RestMiddleware>`
- updated `ResponseTypeMiddleware` middleware, now middleware type has *static* `id` to correspond with `RestMiddlewareType<RestMiddleware>`
- new `@anglr/datetime` dependency version `3.0.0`
- new `@anglr/rest/datetime` subpackage
- subpackage `@anglr/rest/datetime`
    - new `DatetimeRestDateApi` service, that is `RestDateApi` implementation using `@anglr/datetime`
    - new `DATETIME_REST_DATE_API` injection token used as provider for RestDateApi using datetime

### BREAKING CHANGES

- minimal supported version of `@angular` is `14.0.0`
- minimal supported version of `@anglr/common` is `11.2.0`
- dropped support of `NodeJs` version `12`
- removed subpackage `@anglr/rest/date-fns` in favor of `@anglr/datetime`
- removed subpackage `@anglr/rest/moment` in favor of `@anglr/datetime`
- removed `date-fns` dependency
- removed `moment` dependency
- updated `REST_METHOD_MIDDLEWARES` injection token
    - now injects type `RestMiddlewareType<RestMiddleware>[]`
- updated `BASIC_DEFAULT_REST_METHOD_MIDDLEWARES` constant
    - now is of type `RestMiddlewareType<RestMiddleware>[]`
- updated `buildMiddlewares` function, now using new *middlewares* and *middlewareOrder* types
- updated `not` function, now using middleware type `RestMiddlewareType<RestMiddleware>`
- updated `getType` function, now using middleware type `RestMiddlewareType<RestMiddleware>`
- updated `isNotType` function, now using middleware type `RestMiddlewareType<RestMiddleware>`
- updated `DisableMiddleware` decorator, now using middleware type `RestMiddlewareType<RestMiddleware>`
- updated `NotType` class
    - new constructor type `RestMiddlewareType`
    - new generic constraint `TType extends RestMiddleware`
- updated `RestMethodMiddlewares` interface
    - `middlewareTypes` is now of type `RestMiddlewareType<RestMiddleware>[]`
- updated `ParametersMiddlewaresMetadata` interface
    - `middlewareTypes` is now of type `RestMiddlewareType<RestMiddleware>[]`
- updated `BuildMiddlewaresFn` interface
    - parameter `middlewares` is now of type `RestMiddlewareType<RestMiddleware>[]`
    - parameter `middlewaresOrder` is now of type `RestMiddlewareOrderType[]`
- updated `RESTClient` class
    - parameter `methodMiddlewares` is now of type `RestMiddlewareType<RestMiddleware>[]`
    - parameter `middlewaresOrder` is now of type `RestMiddlewareOrderType[]`

## Version 11.2.0 (2022-04-29)

### Features

- new `REST_MOCK_LOGGER` injection token used for injecting MockLogger used for logging responses for mocks
- new `MockLogger` interface, that is service for logging mock responses
    - method `logResponse` logs mock response
- new `MockLoggerMiddleware` middleware, that is used for logging responses for mock usages
- new `AdvancedCacheItem` interface, that is advanced cache item
    - property `response` cached http response
    - property `validUntil` validity date for cache
- new `AdvancedCacheItemOptions` type, that are options for advanced cache item
- new `AdvancedCacheService` service, that allows advanced caching of http responses
    - method `clearCache` clears cache either for specified key, or whole cache
    - method `add` adds response to advanced cache
    - method `get` gets http response from cache, or null if it does not exists
    - method `updateCache` updates existing cache items, if not exists it does nothing
- new `RestAdvancedCaching` interface, contains data that are used for advanced cache service
    - extends `RestClearAdvancedCaching`
    - property `validUntil` relative definition of 'date' for setting validity of cache, example +2d, +12h
- new `RestClearAdvancedCaching` interface, contains data that are used for clearing advanced cache service
    - property `key` key to stored cache item
- new `AdvancedCache` decorator, results of requests are cached in advanced cachce service
- new `AdvancedCacheMiddleware` middleware, that is used for storing and restoring response from advanced cache service
- new `ClearAdvancedCacheMiddleware` middleware, that is used for clearing advanced cache for specific key
- new `ClearAdvancedCache` decorator, that clears advanced cache for key when call is successful
- updated `RestDateApi` interface
    - method `isBeforeNow` tests whether tested date is before now
- subpackage `@anglr/rest/date-fns`
    - updated `DateFnsRestDateApi` to correspond with new `RestDateApi` interface
- subpackage `@anglr/rest/moment`
    - updated `MomentRestDateApi` to correspond with new `RestDateApi` interface


## Version 11.1.0 (2022-04-27)

### Features

- new `DisableMiddleware` decorator, that allows disabling of specified middleware

## Version 11.0.1 (2022-04-07)

### Bug Fixes

- fixed missing exports for `RestProgressIndicatorGroup` and `ProgressIndicatorGroupMiddleware`

## Version 11.0.0 (2022-02-24)

### Bug Fixes

- fixed problem with keeping `this` bound to *Middlewares*, causing *Injector has already been destroyed* after HRM reloading

### BREAKING CHANGES

- updated `RestMiddlewareRunMethod`, now holds only function signature with `this`
- updated `BuildMiddlewaresFn`, removed `this` from function signature

## Version 10.0.2 (2022-02-22)

### Bug Fixes

- fixed typings, not using rolled up typings for now

## Version 10.0.1 (2022-02-21)

### Bug Fixes

- fixed all method decorators, which were not applicable to methods

## Version 10.0.0 (2022-02-15)

### Features

- added new `ResponseTransformFunc` function that is used as response transform function
- added new `ParameterTransformFunc` function that is used as parameter transform function
- added middlewares to process request and response
    - `ProgressIndicatorGroupMiddleware` - middleware that is used for adding support for progress indicator group passing down to progress interceptor
- package `@anglr/rest/avsc`
    - added new `AVRO_REQUEST_DATA`, `AVRO_RESPONSE_DATA` http context tokens for passing AVRO request, response data into interceptor

### BREAKING CHANGES

- minimal supported version of *Angular* is `13.1.0`
- minimal supported version of `@jscrpt/common` is `2.2.0`
- minimal supported version of `@anglr/common` is `10.0.0`
- compiled as *Angular IVY* **only** with new *APF*
- removed support of *es5* target and using latest package.json features
- removed dependency `@anglr/types`, all mising types used directly here
- dropped support of `Node.js <= 12.20`
- removed `AdditionalDataMiddleware` now using `HttpContext` for passing additional data with `HttpRequest`
- removed `RestFullHttpResponse` type which was not doing anything
- removed `ɵRESTClient` which is no longer needed, updated typings
- removed `AdditionalInfoPropertyDescriptor` now using `HttpContext` for passing additional data with `HttpRequest`
- removed `AvroRequestType`, `AvroResponseType` now using `AVRO_REQUEST_DATA`, `AVRO_RESPONSE_DATA` http context tokens

## Version 9.0.0 (2022-02-15)

### Features

- added *subpackage* `@anglr/rest/moment`
- package `@anglr/rest/moment`
    - added new `MomentRestDateApi` as `RestDateApi` implementation using moment js
    - added new `MOMENT_REST_DATE_API` as provider for `REST_DATE_API` using moment js implementation
- added *subpackage* `@anglr/rest/date-fns`
- package `@anglr/rest/date-fns`
    - added new `DateFnsRestDateApi` as `RestDateApi` implementation using date-fns
    - added new `DATE_FNS_REST_DATE_API` as provider for `REST_DATE_API` using date-fns implementation
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
- added new `RestDateApi` used for working with date types in rest
- added new `QueryStringSerializer` which is used for serialization of objects into *query string*
- added new `REST_DATE_API` injection token used for injecting RestDateApi implementation
- added new `ProgressIndicatorGroup` decorator, which allows definition of progress indicator group name for service
- added new `AcceptAny` decorator, which sets `Accept` http header to `*/*`
- added new `TextContentType` decorator, which sets `Content-Type` http header to `text/plain`
- added new `AdditionalInfoPropertyDescriptor`, which allows definition of decorator that will fill `additionalInfo`
- added new `REST_METHOD_MIDDLEWARES` injection token used for injecting array of rest middleware types that defines order of rest middlewares
- added new `REST_MIDDLEWARES_ORDER` injection token used for injecting array of rest middleware types that are default for each rest method
- added new `BASIC_DEFAULT_REST_METHOD_MIDDLEWARES` constant with basic default array of rest middlewares order
- added new `BASIC_DEFAULT_REST_MIDDLEWARES_ORDER` constant with basic defaut array of rest middlewares used for each rest method
- added new `RestMiddleware` interface, that is used for definition of *rest middleware* classes, that are used for building request and processing response
- added new `RestMiddlewareRunMethod` interface, that defines run method signature for *rest middleware*
- added new `BuildMiddlewaresFn` interface, which is defintion of `buildMiddleware` function type
- added new `buildMiddleware` function used for building and returning array of middleware run functions
- added new `ɵRESTClient` interface, which has definition of *private* members of `RESTClient` and makes them available in decorators
- added new `NotType` type, which indicates that this type should be removed during building middlewares
- added new `not` function that helps creating `NotType` which will remove specified middleware type from middlewares
- added new `getType` function that gets underlying `Type` for `Type` and `NotType`
- added new `isNotType` function that gets indication whether is provided `Type` of `NotType`
- added new `ParametersTransformsObj` interface that defines object for parameter transforms
- added new decorator `PATCH` allowin to create *PATCH* http method builder
- `ResponseTransform` decorator now also takes function or array of functions
- `ParameterTransform` decorator now also takes function or array of functions
- *response transform* now also gets input *arguments*
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
    - `ParametersMiddlewaresMetadata` - contains metadata for middleware types for parameters
- added new constants for *Http Header* names
    - `HTTP_HEADER_CONTENT_TYPE` for *Content-Type* header
    - `HTTP_HEADER_ACCEPT` for *Accept* header
- added middlewares to process request and response
    - `ReportProgressMiddleware` - middleware that is used for handling report progress setting, if not set returns only final http response with data
    - `ResponseTypeMiddleware` - middleware that is used for extracting http body and transforming it according to specified response type
    - `ResponseTransformMiddleware` - middleware that is used for adding support of response transform
    - `IgnoredInterceptorsMiddleware` - middleware that is used for adding support for ignored interceptors
    - `AdditionalDataMiddleware`- middleware that is used for adding support for additional info to request from decorators
    - `ProducesMiddleware` - middleware that is used for changing response type
    - `BodyParameterMiddleware` - middleware that is used for adding body to request
    - `HeaderParameterMiddleware` - middleware that is used for adding header from parameter
    - `PathParameterMiddleware` - middleware that is used for modifying request URL path
    - `QueryObjectParameterMiddleware` - middleware that is used for adding query string from query object
    - `QueryParameterMiddleware` - middleware that is used for adding query string parameters
    - `HeadersMiddleware` - middleware that is used for setting custom http headers
    - `CacheMiddleware` - middleware that is used for storing and restoring response from cache
    - `LoggerMiddleware` - middleware that is used for logging requests and responses

### BREAKING CHANGES

- minimal supported version of *Angular* is `10.0.0`
- minimal supported version of `@jscrpt/common` is `1.2.0`
- minimal supported version of `@anglr/common` is `9.0.0`
- minimal supported version of `crypto-js` is `4.0.0`
- removed `jquery-param` as dependency
- added new dependency `moment` for `@anglr/rest/moment`
- changed response type for `getDefaultHeaders` method of `RESTClient`
- completely refactored library and how it works
- changed signature of `responseInterceptor` method of `RESTClient`, `Observable` now must return `HttpEvent`
- changed `RESTClient` constructor parameters

## Version 8.0.0 (2021-12-22)

**DEPRECATED VERSION**

### Features

- added *subpackage* `@anglr/rest/moment`
- package `@anglr/rest/moment`
    - added new `MomentRestDateApi` as `RestDateApi` implementation using moment js
    - added new `MOMENT_REST_DATE_API` as provider for `REST_DATE_API` using moment js implementation
- added *subpackage* `@anglr/rest/date-fns`
- package `@anglr/rest/date-fns`
    - added new `DateFnsRestDateApi` as `RestDateApi` implementation using date-fns
    - added new `DATE_FNS_REST_DATE_API` as provider for `REST_DATE_API` using date-fns implementation
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
    - added new `AvroRequestObj`, `AvroResponseObj` interfaces which defines AVRO data available in interceptor
    - added new `AVRO_REQUEST_DATA`, `AVRO_RESPONSE_DATA` http context tokens for passing AVRO request, response data into interceptor
    - added new `AvroAdapterInterceptor` interceptor, which allows AVRO request and response processing, it works together with `AvroRequest`, `AvroResponse` decorators which tells this interceptor that request or response should be processed and provides information about type
- added new `RestDateApi` used for working with date types in rest
- added new `QueryStringSerializer` which is used for serialization of objects into *query string*
- added new `REST_DATE_API` injection token used for injecting RestDateApi implementation
- added new `ProgressIndicatorGroup` decorator, which allows definition of progress indicator group name for service
- added new `AcceptAny` decorator, which sets `Accept` http header to `*/*`
- added new `TextContentType` decorator, which sets `Content-Type` http header to `text/plain`
- added new `REST_METHOD_MIDDLEWARES` injection token used for injecting array of rest middleware types that defines order of rest middlewares
- added new `REST_MIDDLEWARES_ORDER` injection token used for injecting array of rest middleware types that are default for each rest method
- added new `BASIC_DEFAULT_REST_METHOD_MIDDLEWARES` constant with basic default array of rest middlewares order
- added new `BASIC_DEFAULT_REST_MIDDLEWARES_ORDER` constant with basic defaut array of rest middlewares used for each rest method
- added new `RestMiddleware` interface, that is used for definition of *rest middleware* classes, that are used for building request and processing response
- added new `RestMiddlewareRunMethod` interface, that defines run method signature for *rest middleware*
- added new `BuildMiddlewaresFn` interface, which is defintion of `buildMiddleware` function type
- added new `buildMiddleware` function used for building and returning array of middleware run functions
- added new `NotType` type, which indicates that this type should be removed during building middlewares
- added new `not` function that helps creating `NotType` which will remove specified middleware type from middlewares
- added new `getType` function that gets underlying `Type` for `Type` and `NotType`
- added new `isNotType` function that gets indication whether is provided `Type` of `NotType`
- added new `ParametersTransformsObj` interface that defines object for parameter transforms
- added new `ResponseTransformFunc` function that is used as response transform function
- added new `ParameterTransformFunc` function that is used as parameter transform function
- added new decorator `PATCH` allowin to create *PATCH* http method builder
- `ResponseTransform` decorator now also takes function or array of functions
- `ParameterTransform` decorator now also takes function or array of functions
- *response transform* now also gets input *arguments*
- added new types that are used for helping working with metadata stored in *Descriptor*
    - `RestHttpHeaders` - contains additional headers that will be added
    - `RestResponseType` - contains response type that will be set
    - `RestResponseTransform` - contains response transform function to be called
    - `RestDisabledInterceptors` - contains array of interceptor types that will be disabled
    - `RestReportProgress` - contains indication whether report progress
    - `RestMethod` - contains data that are stored when REST method is set
    - `RestCaching` - contains methods used for handling 'caching'
    - `KeyIndex` - information about parameter key and index
    - `ParametersMetadata` - metadata for parameters
    - `ParametersTransformMetadata` - contains parameters metadata for each decorated method parameters transforms
    - `RestParameters` - contains parameters metadata for each decorated method parameters
    - `RestMethodMiddlewares` - contains rest middleware types that will be used, decorator can add type if it wish to be used
    - `ParametersMiddlewaresMetadata` - contains metadata for middleware types for parameters
- added new constants for *Http Header* names
    - `HTTP_HEADER_CONTENT_TYPE` for *Content-Type* header
    - `HTTP_HEADER_ACCEPT` for *Accept* header
- added middlewares to process request and response
    - `ReportProgressMiddleware` - middleware that is used for handling report progress setting, if not set returns only final http response with data
    - `ResponseTypeMiddleware` - middleware that is used for extracting http body and transforming it according to specified response type
    - `ResponseTransformMiddleware` - middleware that is used for adding support of response transform
    - `IgnoredInterceptorsMiddleware` - middleware that is used for adding support for ignored interceptors
    - `ProducesMiddleware` - middleware that is used for changing response type
    - `BodyParameterMiddleware` - middleware that is used for adding body to request
    - `HeaderParameterMiddleware` - middleware that is used for adding header from parameter
    - `PathParameterMiddleware` - middleware that is used for modifying request URL path
    - `QueryObjectParameterMiddleware` - middleware that is used for adding query string from query object
    - `QueryParameterMiddleware` - middleware that is used for adding query string parameters
    - `HeadersMiddleware` - middleware that is used for setting custom http headers
    - `CacheMiddleware` - middleware that is used for storing and restoring response from cache
    - `LoggerMiddleware` - middleware that is used for logging requests and responses
    - `ProgressIndicatorGroupMiddleware` - middleware that is used for adding support for progress indicator group passing down to progress interceptor

### BREAKING CHANGES

- minimal supported version of *Angular* is `13.1.0`
- minimal supported version of `@jscrpt/common` is `2.2.0`
- minimal supported version of `@anglr/common` is `8.0.0`
- minimal supported version of `crypto-js` is `4.0.0`
- removed `jquery-param` as dependency
- compiled as *Angular IVY* **only** with new *APF*
- removed support of *es5* target and using latest package.json features
- removed dependency `@anglr/types`, all mising types used directly here
- dropped support of `Node.js <= 12.20`
- added new dependency `moment` for `@anglr/rest/moment`
- changed response type for `getDefaultHeaders` method of `RESTClient`
- completely refactored library and how it works
- changed signature of `responseInterceptor` method of `RESTClient`, `Observable` now must return `HttpEvent`
- changed `RESTClient` constructor parameters

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