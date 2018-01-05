# Changelog

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