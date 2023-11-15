import {Injectable, Injector, inject} from '@angular/core';
import {HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import {HTTP_REQUEST_BASE_URL} from '@anglr/common';
import {Observable} from 'rxjs';

import {REST_METHOD_MIDDLEWARES, REST_MIDDLEWARES_ORDER} from '../tokens';
import {RestMiddlewareOrderType, RestMiddlewareType} from '../types';
import {RestMiddleware} from '../../interfaces';

/**
 * Base class for RESTClient class
 */
@Injectable()
export abstract class RESTClientBase
{
    //######################### protected properties #########################

    /**
     * Instance of http client
     */
    protected http: HttpClient = inject(HttpClient);

    /**
     * Instance of injector used for obtaining DI
     */
    protected injector: Injector = inject(Injector);

    /**
     * Array of rest middlewares in specific order in which will be middlewares executed
     */
    protected middlewaresOrder: RestMiddlewareOrderType<string>[] = inject(REST_MIDDLEWARES_ORDER);

    /**
     * Array of middlewares that are executed for each http method
     */
    protected methodMiddlewares: RestMiddlewareType<RestMiddleware>[] = inject(REST_METHOD_MIDDLEWARES);

    /**
     * Base path that is prepended to request URL
     */
    protected baseUrl: string = inject(HTTP_REQUEST_BASE_URL, {optional: true}) ?? '';

    /**
     * Returns the base url of RESTClient
     */
    protected abstract getBaseUrl(): string;

    /**
     * Returns the default headers of RESTClient in a key-value
     */
    protected abstract getDefaultHeaders(): string | {[name: string]: string | string[]};

    /**
     * Request interceptor for all methods, must return new HttpRequest since object is immutable
     * @param req - request object
     */
    protected abstract requestInterceptor(req: HttpRequest<unknown>): HttpRequest<unknown>;

    /**
     * Allows to intercept all responses for all methods in class
     * @param res - response object
     */
    protected abstract responseInterceptor<TBody = unknown>(res: Observable<HttpEvent<TBody>>): Observable<HttpEvent<unknown>>;
}