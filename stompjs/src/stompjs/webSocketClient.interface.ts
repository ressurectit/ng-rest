import {Injector} from '@angular/core';
import {IFrame} from '@stomp/stompjs';
import {Observable} from 'rxjs';

import {SubscribeQueueOptionsInternal, PublishQueueOptionsInternal, SubscribeMetadataData, SubscriptionMetadataData} from './webSocketClient.interface.internal';
import {ResponseType, RequestType, QueueCorrelationPosition} from './webSocketClient.types';

/**
 * Types of errors that can occurs in WebSocket StompJs connection
 */
export type WebSocketErrorType = 'STOMP_ERROR'|'WEB_SOCKET_ERROR';

/**
 * Object storing information about websocket error
 */
export interface WebSocketError
{
    /**
     * Type of error
     */
    type: WebSocketErrorType;

    /**
     * Data passed with information about error
     */
    data: IFrame|Event;
}

/**
 * Represents response for websocket request
 */
export interface WebSocketClientResponse<TQueue>
{
    /**
     * Object holding output observables for each subscribed queue
     */
    readonly output: TQueue;

    /**
     * Explicitly call publish to queue, can be called only once, if called multiple times, rest of calls do nothing
     */
    publish(): void;

    /**
     * Destroys currently registered listeners for response
     */
    destroy(): void;
}

/**
 * Options for subscribe queue decorator
 */
export interface SubscribeQueueDecoratorOptions
{
    /**
     * Name of function used as response transform
     */
    responseTransform?: string;

    /**
     * Name of queue to be subscribed to, if not specified it equals to name
     */
    queueName?: string;

    /**
     * Type that is produced by this queue
     */
    producesType?: ResponseType;

    /**
     * Indication whether is this queue used as status queue
     */
    statusQueue?: boolean;

    /**
     * Code that indicates that no more messages are coming from queue
     */
    completeCode?: string;

    /**
     * Function used for mapping of status queue result to known status queue
     */
    statusQueueMapping?: (response: any) => StatusQueueResponse;

    /**
     * Indication whether automatically complete observable after single response from web socket
     */
    singleResponse?: boolean;

    /**
     * Additional data that is possible to send to subscribe options, can be used in custom middlewares
     */
    additionalData?: Object;
}

/**
 * Options for publish queue decorator
 */
export interface PublishQueueDecoratorOptions
{
    /**
     * Type of request to be sent to server
     */
    type?: RequestType;

    /**
     * Indication whether publish to queue should be delayed and manually run
     */
    delayed?: boolean;

    /**
     * If set, response caching will be enabled, obtains unique identification of request
     */
    cacheResponse?: (body: any) => string;
}

/**
 * Options used for queue correlation
 */
export interface QueueCorrelationOptions
{
    /**
     * Position where should be correlation id positioned, defaults to 'Suffix'
     */
    position: QueueCorrelationPosition;

    /**
     * If position is replace, use this as name that should be looked for and replaced, defaults to 'corrId'
     */
    replacementKey?: string;
}

/**
 * Status queue
 */
export interface StatusQueueResponse
{
    queue?: string;
    done?: number;
    todo?: number;
    code?: string;
    description?: string;
    httpStatus?: number;
    original?: any;
}

/**
 * Middleware that is used to processing result of subscribe
 */
export interface WebSocketHandleResultMiddleware
{
    /**
     * Function represents middleware logic
     */
    (source: Observable<any>, metadata: SubscribeMetadataData, options: SubscribeQueueOptions, publishOptions: PublishQueueOptions, injector: Injector, correlationId: string, name: string): Observable<any>;
}

/**
 * Middleware that is used for processing status queue subscribe result
 */
export interface WebSocketHandleStatusSubscribeMiddleware
{
    /**
     * Function represents middleware logic
     */
    (status: StatusQueueResponse, metadata: SubscribeMetadataData, options: SubscribeQueueOptions, publishOptions: PublishQueueOptions, subscriptionMetadata: SubscriptionMetadataData, injector: Injector, correlationId: string, name: string): void;
}

/**
 * Status queue generic
 */
export interface StatusQueueResponseGeneric<TOriginal> extends StatusQueueResponse
{
    original?: TOriginal;
}

/**
 * Options for subscribe queue
 */
export type SubscribeQueueOptions = SubscribeQueueDecoratorOptions & SubscribeQueueOptionsInternal;

/**
 * Options for publish queue
 */
export type PublishQueueOptions = PublishQueueDecoratorOptions & PublishQueueOptionsInternal;