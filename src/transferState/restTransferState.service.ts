import {Injectable} from '@angular/core';
import {TransferState, makeStateKey} from '@angular/platform-browser';

/**
 * Name of key storing REST service keys
 */
const REST_TRANSFER_KEYS = 'REST_TRANSFER_KEYS';

/**
 * Service used for transfering data between server and browser for RESTClient
 */
@Injectable({providedIn: 'root'})
export class RestTransferStateService
{
    //######################### private fields #########################

    /**
     * Indication that RestTransferStateService is deactivated
     */
    private _deactivated: boolean = false;

    //######################### public properties #########################

    /**
     * Gets indication
     */
    public get deactivated(): boolean
    {
        return this._deactivated;
    }

    //######################### constructor #########################
    constructor(private _transferState: TransferState)
    {
    }

    //######################### public methods #########################

    /**
     * Clears rest transfer state stored data
     */
    public clearAndDeactivate(): void
    {
        this._transferState.get<string[]>(makeStateKey(REST_TRANSFER_KEYS), []).forEach(key => this._transferState.remove(makeStateKey(key)));
        this._deactivated = true;
    }

    /**
     * Gets indication whether requested key exist in stored transfer key data
     * @param key 
     */
    public hasKey(key: string): boolean
    {
        return this._transferState.hasKey(makeStateKey(key));
    }

    /**
     * Gets value stored identified by key
     * @param key Key identifying value
     */
    public get(key: string): any
    {
        return this._transferState.get<any>(makeStateKey(key), null);
    }

    /**
     * Sets value to be stored with specified key, and returns self
     * @param key Key for storing value
     * @param value Value that is going to be stored
     */
    public set(key: string, value: any): RestTransferStateService
    {
        this._transferState.set<any>(makeStateKey(key), value);

        let restKeys = this._transferState.get<string[]>(makeStateKey(REST_TRANSFER_KEYS), []);
        
        if(!restKeys.find(itm => itm == key))
        {
            restKeys.push(key);

            this._transferState.set<string[]>(makeStateKey(REST_TRANSFER_KEYS), restKeys);
        }

        return this;
    }
}