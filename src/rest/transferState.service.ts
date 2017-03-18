import {Injectable} from '@angular/core';

/**
 * Service used for transfering data between server and browser
 */
@Injectable()
export class TransferStateService
{
    //######################### private fields #########################

    /**
     * Map storing data
     */
    private _map = new Map < string, any > ();

    //######################### constructor #########################
    constructor()
    {
    }

    //######################### public methods #########################

    /**
     * Gets keys stored in this state
     */
    public keys()
    {
        return this._map.keys();
    }

    /**
     * Clears current cache object
     */
    public clear()
    {
        this._map.clear();
    }

    /**
     * Gets value stored identified by key
     * @param {string} key Key identifying value
     */
    public get(key: string): any
    {
        return this._map.get(key);
    }

    /**
     * Sets value to be stored with specified key
     * @param {string} key Key for storing value
     * @param {any} value Value that is going to be stored
     */
    public set(key: string, value: any): Map < string, any >
    {
        return this._map.set(key, value);
    }

    /**
     * Serialize content of current state
     */
    public toJson(): any
    {
        const obj = {};
        Array.from(this.keys())
            .forEach(key =>
            {
                obj[key] = this.get(key);
            });
        return obj;
    }

    /**
     * Intialize state from object
     * @param {any} obj Object that is going to be used for initialization of state
     */
    public initialize(obj: any): void
    {
        Object.keys(obj)
            .forEach(key =>
            {
                this.set(key, obj[key]);
            });
    }

    /**
     * Injects serialized value into html
     */
    public inject(): void
    {
    }
}