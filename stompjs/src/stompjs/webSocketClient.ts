import {Injectable, Injector} from '@angular/core';
import {generateId, extend} from '@jscrpt/common';
import {Client, StompConfig} from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';

/**
 * WebSocketClient base class.
 */
@Injectable()
export abstract class WebSocketClient
{
    //######################### private fields #########################

    /**
     * Instance of opened WebSocket stomp client
     */
    private _wsClient: Client;

    /**
     * Session id used for identification of web socket session
     */
    private _sessionId: string = generateId(10);

    /**
     * Method that is used for resolving active promise
     */
    private _activeResolve: () => void;

    //######################### protected properties/fields #########################

    /**
     * Promise that is resolved when connection is active
     */
    protected active: Promise<void>;

    /**
     * Instance of opened WebSocket stomp client
     */
    protected get wsClient(): Client
    {
        if(!this._wsClient)
        {
            this._wsClient = new Client(extend(true,
                                               <StompConfig>
                                               {
                                                   onConnect: () =>
                                                   {
                                                       this._activeResolve();
                                                   },
                                                   onDisconnect: () =>
                                                   {
                                                       console.log('disconnected');
                                                   },
                                                   logRawCommunication: false
                                                //    debug: str => console.log(str)
                                               },
                                               this.getConnection()));

            this._wsClient.activate();
        }

        return this._wsClient;
    }

    //######################### constructor #########################
    constructor(protected injector?: Injector)
    {
        this._setActivePromise();
    }

    //######################### public methods #########################

    /**
     * Destroys created web socket connection
     */
    public destroy()
    {
        if(this._wsClient)
        {
            this._wsClient.deactivate();
            this._wsClient = null;
        }

        this._setActivePromise();
    }

    //######################### protected methods #########################

    /**
     * Returns the base url of WebSocketClient
     */
    protected getBaseUrl(): string
    {
        return "";
    };

    /**
     * Returns prefix for all publish queues
     */
    protected getPublishQueuePrefix(): string
    {
        return "";
    }

    /**
     * Returns prefix for all subscribe queues
     */
    protected getSubscribeQueuePrefix(): string
    {
        return "";
    }

    /**
     * Returns name of property storing correlation id in body
     */
    protected getCorrelationBodyProperty(): string
    {
        return null;
    }

    /**
     * Returns indication whether use session id suffix
     */
    protected useSessionIdSuffix(): boolean
    {
        return false;
    }

    /**
     * Returns indication whether use correlation id as queue suffix 
     */
    protected useQueueCorrelation(): boolean
    {
        return false;
    }

    /**
     * Gets configuration part that is used for obtaining underhood WebSocket engine
     */
    protected getConnection(): StompConfig
    {
        return {
            webSocketFactory: () =>
            {
                return new SockJS(this.getBaseUrl(), [],
                {
                    sessionId: () =>
                    {
                        return this._sessionId
                    }
                });
            }
        };
    }

    //######################### private methods #########################

    /**
     * Sets active promise to its default state
     */
    private _setActivePromise()
    {
        this.active = new Promise(resolve =>
        {
            this._activeResolve = resolve;
        });
    }
}