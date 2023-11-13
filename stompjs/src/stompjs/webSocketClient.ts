import {Injectable, Injector, Inject, OnDestroy} from '@angular/core';
import {Logger, LOGGER} from '@anglr/common';
import {generateId, extend} from '@jscrpt/common';
import {Client, StompConfig} from '@stomp/stompjs';
import {ReplaySubject, Observable} from 'rxjs';
import SockJS from 'sockjs-client';

import {QueueCorrelationOptions, WebSocketError} from './webSocketClient.interface';
import {QueueCorrelationPosition} from './webSocketClient.types';

/**
 * WebSocketClient base class.
 */
@Injectable()
export abstract class WebSocketClient implements OnDestroy
{
    //######################### private fields #########################

    /**
     * Instance of opened WebSocket stomp client
     */
    private _wsClient: Client|null = null;

    /**
     * Session id used for identification of web socket session
     */
    private _sessionId: string = generateId(10);

    /**
     * Method that is used for resolving active promise
     */
    private _activeResolve!: () => void;

    /**
     * Subject used for emitting communication errors
     */
    private _errorSubject: ReplaySubject<WebSocketError> = new ReplaySubject<WebSocketError>();

    /**
     * Subject used for emitting when socket was closed
     */
    private _closeSubject: ReplaySubject<CloseEvent> = new ReplaySubject<CloseEvent>();

    //######################### protected properties/fields #########################

    /**
     * Promise that is resolved when connection is active
     */
    protected active!: Promise<void>;

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
                                                       this.logger.info('WebSocket: client onConnect called');

                                                       this._activeResolve();
                                                   },
                                                   onDisconnect: () =>
                                                   {
                                                       this.logger.info('WebSocket: client onDisconnect called');

                                                       this._resetConnection();
                                                   },
                                                   onStompError: error =>
                                                   {
                                                       this.logger.error('WebSocket: client onStompError called, \'{{@error}}\'', {error});

                                                       this._resetConnection();

                                                       this._errorSubject.next(
                                                       {
                                                           type: 'STOMP_ERROR',
                                                           data: error
                                                       });
                                                   },
                                                   onWebSocketClose: close =>
                                                   {
                                                       this.logger.warn('WebSocket: client onWebSocketClose called, \'{{@close}}\'', {close});

                                                       this._resetConnection();

                                                       this._closeSubject.next(close);
                                                   },
                                                   onWebSocketError: error =>
                                                   {
                                                       this.logger.error('WebSocket: client onWebSocketError called, \'{{@error}}\'', {error});

                                                       this._resetConnection();

                                                       this._errorSubject.next(
                                                       {
                                                           type: 'WEB_SOCKET_ERROR',
                                                           data: error
                                                       });
                                                   },
                                                   logRawCommunication: false,
                                                   reconnectDelay: 0
                                                //    debug: str => console.log(str)
                                               },
                                               this.getConnection()));

            this._wsClient.activate();
        }

        return this._wsClient;
    }

    //######################### public properties #########################

    /**
     * Observable that emits messages on errors
     */
    public get error(): Observable<WebSocketError>
    {
        return this._errorSubject.asObservable();
    }

    /**
     * Observable that emits messages on socket close
     */
    public get close(): Observable<CloseEvent>
    {
        return this._closeSubject.asObservable();
    }

    //######################### constructor #########################
    constructor(protected injector: Injector,
                @Inject(LOGGER) protected logger: Logger)
    {
        this.logger.verbose('WebSocket: client constructor');

        this._setActivePromise();
    }

    //######################### public methods - implementation of OnDestroy #########################
    
    /**
     * Called when component is destroyed
     */
    public ngOnDestroy(): void
    {
        this.destroy();
    }

    //######################### public methods #########################

    /**
     * Destroys created web socket connection
     */
    public destroy(): void
    {
        this.logger.verbose('WebSocket: destroying client');

        if(this._wsClient)
        {
            this.logger.verbose('WebSocket: deactivating client');

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
        return '';
    }

    /**
     * Returns prefix for all publish queues
     */
    protected getPublishQueuePrefix(): string
    {
        return '';
    }

    /**
     * Returns prefix for all subscribe queues
     */
    protected getSubscribeQueuePrefix(): string
    {
        return '';
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
     * Returns object describing how to use correlation id
     */
    protected useQueueCorrelation(): QueueCorrelationOptions
    {
        return {
            position: QueueCorrelationPosition.None
        };
    }

    /**
     * Gets configuration part that is used for obtaining underhood WebSocket engine
     */
    protected getConnection(): StompConfig
    {
        return {
            webSocketFactory: () =>
            {
                this.logger.verbose('WebSocket: new connection created');

                return new SockJS(this.getBaseUrl(), [],
                <any>
                {
                    sessionId: () =>
                    {
                        return this._sessionId;
                    },
                    transports: 'websocket',
                    timeout: 30000
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

    /**
     * Resets connection
     */
    private _resetConnection()
    {
        this.logger.verbose(`WebSocket: Reseting connection, old session id '${this._sessionId}'`);

        this._wsClient = null;
        this._sessionId = generateId(10);

        this._setActivePromise();
    }
}