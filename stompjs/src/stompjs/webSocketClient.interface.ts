import {SubscribeQueueOptionsInternal, PublishQueueOptionsInternal} from "./webSocketClient.interface.internal";
import {ResponseType, RequestType} from "./webSocketClient.types";

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
    publish();

    /**
     * Destroys currently registered listeners for response
     */
    destroy();
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
}

/**
 * Options for subscribe queue
 */
export type SubscribeQueueOptions = SubscribeQueueDecoratorOptions & SubscribeQueueOptionsInternal;

/**
 * Options for publish queue
 */
export type PublishQueueOptions = PublishQueueDecoratorOptions & PublishQueueOptionsInternal;