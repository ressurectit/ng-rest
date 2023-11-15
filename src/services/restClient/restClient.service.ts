import {Injectable} from '@angular/core';
import {HttpEvent, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';

import {RESTClientBase} from '../../misc/classes/restClientBase';

/**
 * Angular RESTClient base class.
 */
@Injectable()
export abstract class RESTClient extends RESTClientBase
{
    /**
     * @inheritdoc
     */
    protected getBaseUrl(): string
    {
        return '';
    }

    /**
     * @inheritdoc
     */
    protected getDefaultHeaders(): string | {[name: string]: string | string[]}
    {
        return {};
    }

    /**
     * @inheritdoc
     */
    protected requestInterceptor(req: HttpRequest<unknown>): HttpRequest<unknown>
    {
        return req;
    }

    /**
     * @inheritdoc
     */
    protected responseInterceptor<TBody = unknown>(res: Observable<HttpEvent<TBody>>): Observable<HttpEvent<unknown>>
    {
        return res;
    }
}