import {Inject, Injectable} from '@angular/core';
import {HttpParams} from '@angular/common/http';
import {isBlank, isBoolean, isFunction, isJsObject, isNumber, isString} from '@jscrpt/common';

import {RestDateApi} from './rest.interface';
import {REST_DATE_API} from './tokens';

/**
 * Query string serializer used for serializing objects into query string
 */
@Injectable({providedIn: 'root'})
export class QueryStringSerializer<TDate = any>
{
    //######################### constructor #########################
    constructor(@Inject(REST_DATE_API) protected _dateApi: RestDateApi<TDate>)
    {
    }

    //######################### public methods #########################
    
    /**
     * Serializes object into query string
     * @param obj - Object to be serialized
     * @param keyPrefix - Key prefix to be used
     */
    public serializeObject(obj: object, keyPrefix: string = ''): string|null
    {
        if(!isJsObject(obj))
        {
            return null;
        }

        const queryParams: string[] = [];

        const switchVal = (key: string, val: any) =>
        {
            //ignore empty values
            if(isBlank(val) || isFunction(val))
            {
                return;
            }
            else if(Array.isArray(val))
            {
                val.forEach((itm, index) =>
                {
                    switchVal(isJsObject(itm) ? `${key}[${index}]` : key, itm);
                });
            }
            //is date
            else if(this._dateApi.isDate(val))
            {
                queryParams.push(`${keyPrefix}${key}=${this._dateApi.toString(val)}`);
            }
            else if(isString(val))
            {
                queryParams.push(`${keyPrefix}${key}=${val}`);
            }
            else if(isNumber(val) || isBoolean(val))
            {
                queryParams.push(`${keyPrefix}${key}=${val.toString()}`);
            }
            else if(isJsObject(val))
            {
                queryParams.push(this.serializeObject(val, `${key}.`));
            }
        }

        Object.keys(obj).forEach(key =>
        {
            const val = obj[key];

            switchVal(key, val);
        });

        return queryParams.join('&');
    }

    /**
     * Serializes object into HttpParams object
     * @param obj - Object to be serialized
     */
    public serializeObjectToParams(obj: object): HttpParams|null
    {
        const queryString = this.serializeObject(obj);

        if(isBlank(queryString))
        {
            return null;
        }

        return new HttpParams({fromString: queryString});
    }
}