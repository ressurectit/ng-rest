[![npm version](https://badge.fury.io/js/%40anglr%2Frest.svg)](https://badge.fury.io/js/%40anglr%2Frest)
[![Build status](https://ci.appveyor.com/api/projects/status/92d634q2sky7gvkx?svg=true)](https://ci.appveyor.com/project/kukjevov/ng-rest)

# Angular Rest Client

Angular HTTP client to consume RESTful services. Built on `@angular/http` with TypeScript.  

- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)
- [API](https://ressurectit.github.io/#/content/api/ng-rest/rest)
- [API AVSC](https://ressurectit.github.io/#/content/api/ng-rest-avsc/rest-avsc)
- [API Date FNS](https://ressurectit.github.io/#/content/api/ng-rest-date-fns/rest-date-fns)
- [API Moment](https://ressurectit.github.io/#/content/api/ng-rest-moment/rest-moment)
- [API StompJs](https://ressurectit.github.io/#/content/api/ng-rest-stompjs/rest-stompjs)

## Description

- Module with decorators to make class RESTfull
- TODO - add description

## Installation

```sh
npm install @anglr/rest --save
```

### SystemJs Usage

In your **SystemJs** configuration script add following lines to `packages` configuration section:

```javascript
packages:
{
    '@anglr/rest': 
    {
        main: "dist/index.min.js",
        defaultExtension: 'js'
    }
}
```

### Webpack Usage

This depends on your preferences, but you can use it as any other angular module, just use it in code and webpack will automatically add it to result `.js` file.


## Usage

*config/global.json*
```json
{
    "apiBaseUrl": "api/",
    "defaultApiHeaders": 
    {
        "Accept": "application/json"
    }
}
```

*user.interface.ts*
```typescript
export interface User
{
    id?: string;
    name?: string;
    surname?: string;
    birthDate?: moment.Moment;
}

export interface Paging
{
    from?: number;
    to?: number;
}
```

*user.service.ts*
```typescript
import {Injectable} from '@angular/core';
import {RESTClient, GET, POST, Path, Body, Query, BaseUrl, DefaultHeaders, Produces, ResponseType, ResponseTransform, LocationHeaderResponse} from '@anglr/rest';
import {isPresent} from '@jscrpt/common';
import {User, Paging} from './user.interface';
import {Observable} from 'rxjs';
import global from 'config/global';
import moment from 'moment';

/**
 * Service used to access User REST resource
 */
@Injectable()
@BaseUrl(global.apiBaseUrl)
@DefaultHeaders(global.defaultApiHeaders)
export class UserService extends RESTClient
{
    //######################### public methods #########################

    /**
     * Gets available users by specified criteria
     */
    @Produces(ResponseType.Json)
    @ResponseTransform()
    @GET("users")
    public getAll(@Query("surname") surname: string,
                  @QueryObject paging?: Paging,
                  @Query("name") name?: string): Observable<User[]>
    {
        return null;
    }

    /**
     * Gets specified user by id
     */
    @Produces(ResponseType.Json)
    @GET("users/{id}")
    public get(@Path("id") id: string): Observable<User>
    {
        return null;
    }

    /**
     * Creates new user
     */
    @Produces(ResponseType.LocationHeader)
    @JsonContentType()
    @POST("users")
    public createUser(@Body user: User): Observable<LocationHeaderResponse>
    {
        return null;
    }

    //######################### private methods #########################

    /**
     * Transform response from getAll method
     */
    private getAllResponseTransform(response: Observable<User[]>): Observable<User[]>
    {
        return response.map(result =>
        {
            if(result && result.length > 0)
            {
                result.forEach(user => 
                {
                    if(isPresent(user.birthDate))
                    {
                        user.birthDate = moment(user.birthDate);
                    
                        if(!user.birthDate.isValid)
                        {
                            user.birthDate = null;
                        }
                    }
                });
            }

            return result;
        });
    }
}
```

## API

### `RESTClient` - Angular RESTClient base class.

#### *Properties*
 - TODO - constructor properties

#### *Methods*
- `getBaseUrl(): string` - Returns the base url of RESTClient
- `getDefaultHeaders(): Object` - Returns the default headers of RESTClient in a key-value pair
- `requestInterceptor(req: Request): void` - Request interceptor for all methods in class
  - `req: Request` - Http Request that can be intercepted
- `responseInterceptor(res: Observable<any>): Observable<any>` - Allows to intercept all responses for all methods in class
  - `res: Observable<any>` - response that can be intercepted
  - *return* - returns new response

### Class decorators:
- `@BaseUrl(url: string)`
- `@DefaultHeaders(headers: Object)`

### Method decorators:
- `@GET(url: String)`
- `@POST(url: String)`
- `@PUT(url: String)`
- `@DELETE(url: String)`
- `@Headers(headers: Object)`
- `@JsonContentType()`
- `@FormDataContentType()`
- `@Produces(producesDef: ResponseType)`
- `@ResponseTransform(methodName?: string)`
- `@Cache()`

### Parameter decorators:
- `@Path(key: string)`
- `@Query(key: string)`
- `@Header(key: string)`
- `@Body`
- `@QueryObject`
- `@PlainBody`
- `@ParameterTransform`

# License

MIT
