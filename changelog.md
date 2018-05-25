# Changelog

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