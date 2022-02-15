import {InjectionToken} from "@angular/core";
import {WebSocketHandleResultMiddleware, WebSocketHandleStatusSubscribeMiddleware} from "./webSocketClient.interface";

/**
 * Supported Produces response types
 */
export enum ResponseType
{
    Json,
    Text
}

/**
 * Supported PublishQueue request types
 */
export enum RequestType
{
    Json,
    Text
}

/**
 * How to use queue correlation id
 */
export enum QueueCorrelationPosition
{
    /**
     * Correlation id will not be used
     */
    None,

    /**
     * Correlation id will be used as prefix of queue/publish name
     */
    Prefix,

    /**
     * Correlation id will be used as suffix of queue/publish name
     */
    Suffix,

    /**
     * Correlation id will replace specified constant in whole (including prefix) queue/publish string
     */
    Replace
}

/**
 * Default web socket handle result middleware, multi providers are required for this token
 */
export const DEFAULT_WEB_SOCKET_HANDLE_RESULT_MIDDLEWARE: InjectionToken<WebSocketHandleResultMiddleware[]> = new InjectionToken<WebSocketHandleResultMiddleware[]>('DEFAULT_WEB_SOCKET_HANDLE_RESULT_MIDDLEWARE');

/**
 * Web socket handle result middlewares, allows modification of default middlewares
 */
export const WEB_SOCKET_HANDLE_RESULT_MIDDLEWARE: InjectionToken<WebSocketHandleResultMiddleware[]> = new InjectionToken<WebSocketHandleResultMiddleware[]>('WEB_SOCKET_HANDLE_RESULT_MIDDLEWARE');

/**
 * Default web socket handle status subscribe middleware, multi providers are required for this token
 */
export const DEFAULT_WEB_SOCKET_HANDLE_STATUS_SUBSCRIBE_MIDDLEWARE: InjectionToken<WebSocketHandleStatusSubscribeMiddleware[]> = new InjectionToken<WebSocketHandleStatusSubscribeMiddleware[]>('DEFAULT_WEB_SOCKET_HANDLE_STATUS_SUBSCRIBE_MIDDLEWARE');

/**
 * Web socket handle status subscribe middlewares, allows modification of default middlewares
 */
export const WEB_SOCKET_HANDLE_STATUS_SUBSCRIBE_MIDDLEWARE: InjectionToken<WebSocketHandleStatusSubscribeMiddleware[]> = new InjectionToken<WebSocketHandleStatusSubscribeMiddleware[]>('WEB_SOCKET_HANDLE_STATUS_SUBSCRIBE_MIDDLEWARE');