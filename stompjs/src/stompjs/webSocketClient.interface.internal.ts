import {Injector} from "@angular/core";
import {Client, StompConfig, StompSubscription} from "@stomp/stompjs";
import {Observable, Subject} from "rxjs";

import {ResponseType} from './webSocketClient.types';
import {PublishQueueOptions} from "./webSocketClient.interface";

/**
 * Interface that is used for accessing private, protected and public members of WebSocketClient
 */
export interface WebSocketClientPublic
{
    //######################### properties/fields #########################

    /**
     * Instance of opened WebSocket stomp client
     */
    readonly wsClient: Client;

    /**
     * Instance of angular injector
     */
    readonly injector: Injector;

    /**
     * Session id used for identification of web socket session
     */
    readonly _sessionId: string;

    /**
     * Promise that is resolved when connection is active
     */
    readonly active: Promise<void>;

    //######################### methods #########################

    /**
     * Destroys created web socket connection
     */
    destroy();

    /**
     * Returns the base url of WebSocketClient
     */
    getBaseUrl(): string;

    /**
     * Gets configuration part that is used for obtaining underhood WebSocket engine
     */
    getConnection(): StompConfig;

    /**
     * Returns prefix for all publish queues
     */
    getPublishQueuePrefix(): string;

    /**
     * Returns prefix for all subscribe queues
     */
    getSubscribeQueuePrefix(): string;

    /**
     * Returns name of property storing correlation id in body
     */
    getCorrelationBodyProperty(): string;

    /**
     * Returns indication whether use session id suffix
     */
    useSessionIdSuffix(): boolean;

    /**
     * Returns indication whether use correlation id as queue suffix 
     */
    useQueueCorrelation(): boolean;
}

/**
 * Options specific for publish queue
 */
export interface PublishQueueOptionsBase
{
    /**
     * Prefix for all publish queues
     */
    publishQueuePrefix?: string;
}

/**
 * Options specific for subscribe queue
 */
export interface SubscribeQueueOptionsBase
{
    /**
     * Prefix for all subscribe queues
     */
    subscribeQueuePrefix?: string;
}

/**
 * Options for WebSocketClient base
 */
export interface WebSocketClientOptionsBase
{
    /**
     * Name of property that holds correlation id
     */
    correlationBodyProperty?: string;

    /**
     * Indication whether use correlation id as part of queue suffix
     */
    queueCorrelation?: boolean;

    /**
     * Indication whether use session id suffix in queue suffix
     */
    sessionIdSuffix?: boolean;
}

/**
 * Options that are used withing WebSocketClient requests and responses
 */
export type WebSocketClientOptions = WebSocketClientOptionsBase & SubscribeQueueOptionsBase & PublishQueueOptionsBase;

/**
 * Options for subscribe queue internal
 */
export type SubscribeQueueOptionsInternal = SubscribeQueueOptionsBase & WebSocketClientOptionsBase;

/**
 * Options for publish queue internal
 */
export type PublishQueueOptionsInternal = PublishQueueOptionsBase & WebSocketClientOptionsBase;

/**
 * Options passed to WebSocketClientResponse
 */
export interface WebSocketClientResponseOptions
{
    /**
     * Subscribe metadata, information about subscribe queues
     */
    subscribe: SubscribeMetadata;

    /**
     * Name of publish queue
     */
    publish: string;

    /**
     * Body that is sent to publish queue
     */
    body: string|Object;

    /**
     * Options for requests and responses for WebSocketClient
     */
    webSocketOptions?: WebSocketClientOptions;

    /**
     * Options used for publish queue
     */
    options?: PublishQueueOptions;
}

/**
 * Metadata added to descriptor for each subscribe
 */
export interface SubscribeMetadata
{
    /**
     * Name of subscription that will be created in output
     */
    [queue: string]:
    {
        /**
         * Function that will be used as response transform
         */
        responseTransformFunc?: (response: Observable<any>) => Observable<any>;

        /**
         * Name of queue to be subscribed to, if not specified it equals to name
         */
        queueName?: string;

        /**
         * Type that is produced by this queue
         */
        producesType?: ResponseType;

        /**
         * Options for subscribe queue
         */
        options?: SubscribeQueueOptionsInternal;
    };
}

/**
 * Metadata holding subscription for queues
 */
export interface SubscriptionMetadata
{
    /**
     * Name of subscription queue
     */
    [queue: string]:
    {
        /**
         * Subscription to queue
         */
        subscription?: StompSubscription;

        /**
         * Subject used for emitting to output
         */
        subject: Subject<any>;
    };
}