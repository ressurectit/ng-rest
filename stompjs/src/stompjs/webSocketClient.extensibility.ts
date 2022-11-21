import {ValueProvider, FactoryProvider, Injector} from '@angular/core';
import {HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import {Logger, LOGGER, ProgressIndicatorService} from '@anglr/common';
import {isPresent} from '@jscrpt/common';
import {IMessage} from '@stomp/stompjs';
import {Observable, map, filter} from 'rxjs';

import {DEFAULT_WEB_SOCKET_HANDLE_RESULT_MIDDLEWARE, ResponseType, WEB_SOCKET_HANDLE_RESULT_MIDDLEWARE, WEB_SOCKET_HANDLE_STATUS_SUBSCRIBE_MIDDLEWARE, DEFAULT_WEB_SOCKET_HANDLE_STATUS_SUBSCRIBE_MIDDLEWARE} from './webSocketClient.types';
import {SubscribeMetadataData, SubscriptionMetadataData} from './webSocketClient.interface.internal';
import {SubscribeQueueOptions, WebSocketHandleResultMiddleware, WebSocketHandleStatusSubscribeMiddleware, StatusQueueResponse, PublishQueueOptions} from './webSocketClient.interface';

/**
 * Factory function for creating WEB_SOCKET_HANDLE_RESULT_MIDDLEWARE
 */
export function WebSocketHandleResultMiddlewareFactory(handleResultMiddlewares: WebSocketHandleResultMiddleware[]): WebSocketHandleResultMiddleware[]
{
    return handleResultMiddlewares;
}

/**
 * Factory function for creating WEB_SOCKET_HANDLE_STATUS_SUBSCRIBE_MIDDLEWARE
 */
export function WebSocketHandleStatusSubscribeMiddlewareFactory(handleStatusMiddlewares: WebSocketHandleStatusSubscribeMiddleware[]): WebSocketHandleStatusSubscribeMiddleware[]
{
    return handleStatusMiddlewares;
}

export function WebSocketHandleProducesType(source: Observable<any>, metadata: SubscribeMetadataData)
{
    //map response type
    switch(metadata.producesType)
    {
        default:
        //case ResponseType.Json:
        {
            source = source.pipe(map((itm: IMessage) => JSON.parse(itm.body)));

            break;
        }
        case ResponseType.Text:
        {
            source = source.pipe(map((itm: IMessage) => itm.body));

            break;
        }
    }

    return source;
}

/**
 * Middleware provider used for handling produces type for result
 */
export const WEB_SOCKET_HANDLE_PRODUCES_TYPE_PROVIDER: ValueProvider =
{
    provide: DEFAULT_WEB_SOCKET_HANDLE_RESULT_MIDDLEWARE,
    multi: true,
    useValue: WebSocketHandleProducesType
};

/**
 * @internal
 */
export function WebSocketHandleFilterNonMatching(source: Observable<any>, metadata: SubscribeMetadataData, options: SubscribeQueueOptions, _publishOptions: PublishQueueOptions, _injector: Injector, correlationId: string)
{
    //filter out non matching results
    if(isPresent(options.correlationBodyProperty) && metadata.producesType == ResponseType.Json)
    {
        source = source.pipe(filter(itm => itm[options.correlationBodyProperty!] == correlationId));
    }

    return source;
}

/**
 * Middleware provider used for filtering non matching results
 */
export const WEB_SOCKET_HANDLE_FILTER_NON_MATCHING_PROVIDER: ValueProvider =
{
    provide: DEFAULT_WEB_SOCKET_HANDLE_RESULT_MIDDLEWARE,
    multi: true,
    useValue: WebSocketHandleFilterNonMatching
};

/**
 * @internal
 */
export function WebSocketHandleResponseTransform(source: Observable<any>, metadata: SubscribeMetadataData)
{
    //apply response transform
    if(isPresent(metadata.responseTransformFunc))
    {
        source = metadata.responseTransformFunc(source);
    }

    return source;
}

/**
 * Middleware provider used for handling response transform
 */
export const WEB_SOCKET_HANDLE_RESPONSE_TRANSFORM_PROVIDER: ValueProvider =
{
    provide: DEFAULT_WEB_SOCKET_HANDLE_RESULT_MIDDLEWARE,
    multi: true,
    useValue: WebSocketHandleResponseTransform
};

/**
 * @internal
 */
export function WebSocketHandleStatusProgressIndicator(status: StatusQueueResponse, _metadata: SubscribeMetadataData, _options: SubscribeQueueOptions, _publishOptions: PublishQueueOptions, _subscriptionMetadata: SubscriptionMetadataData, injector: Injector, _correlationId: string, name: string): void
{
    const logger: Logger = injector.get(LOGGER);
    const progressIndicator: ProgressIndicatorService = injector.get(ProgressIndicatorService);

    if(status.code == 'REGISTER')
    {
        logger.verbose(`WebSocket: show progress indicator '${status.queue}'`);
        progressIndicator.showProgress();
    }

    if(status.queue == 'status' && status.code != 'REGISTER' && status.code != 'FINAL')
    {
        logger.verbose(`WebSocket: progress indicator message '${name}', '${status.queue}', '${status.description}'`);
        progressIndicator.addMessage(status.description!);
    }

    if(status.code == 'FINAL' || status.httpStatus! >= 400)
    {
        logger.verbose(`WebSocket: hide progress indicator '${status.queue}'`);
        progressIndicator.hideProgress();
    }
}

/**
 * Middleware provider used for handling status displaying progress indicator
 */
export const WEB_SOCKET_HANDLE_STATUS_PROGRESS_INDICATOR_PROVIDER: ValueProvider =
{
    provide: DEFAULT_WEB_SOCKET_HANDLE_STATUS_SUBSCRIBE_MIDDLEWARE,
    multi: true,
    useValue: WebSocketHandleStatusProgressIndicator
};

/**
 * @internal
 */
export function WebSocketHandleStatusErrorComplete(status: StatusQueueResponse, _metadata: SubscribeMetadataData, options: SubscribeQueueOptions, _publishOptions: PublishQueueOptions, subscriptionMetadata: SubscriptionMetadataData, injector: Injector): void
{
    const logger: Logger = injector.get(LOGGER);

    if(subscriptionMetadata)
    {
        if(status.httpStatus! >= 400)
        {
            logger.error(`WebSocket: error status code '${status.httpStatus}', response {@status}`, status);

            jsDevMode && console.error(`Queue received failure response ${status.queue}`, status);

            const error = new HttpErrorResponse(
            {
                status: status.httpStatus,
                statusText: status.code,
                url: status.queue,
                headers: new HttpHeaders(),
                error:
                {
                    message: status.description
                }
            });

            subscriptionMetadata.subject.error(error);
        }

        if(isPresent(options.completeCode) && status.code == options.completeCode)
        {
            subscriptionMetadata.subject.complete();
        }
    }
}

/**
 * Middleware provider used for handling status error and completition
 */
export const WEB_SOCKET_HANDLE_STATUS_ERROR_COMPLETE_PROVIDER: ValueProvider =
{
    provide: DEFAULT_WEB_SOCKET_HANDLE_STATUS_SUBSCRIBE_MIDDLEWARE,
    multi: true,
    useValue: WebSocketHandleStatusErrorComplete
};

/**
 * Provider for WEB_SOCKET_HANDLE_RESULT_MIDDLEWARE
 */
export const WEB_SOCKET_HANDLE_RESULT_MIDDLEWARE_PROVIDER: FactoryProvider =
{
    provide: WEB_SOCKET_HANDLE_RESULT_MIDDLEWARE,
    useFactory: WebSocketHandleResultMiddlewareFactory,
    deps: [DEFAULT_WEB_SOCKET_HANDLE_RESULT_MIDDLEWARE]
};

/**
 * Provider for WEB_SOCKET_HANDLE_STATUS_SUBSCRIBE_MIDDLEWARE
 */
export const WEB_SOCKET_HANDLE_STATUS_SUBSCRIBE_MIDDLEWARE_PROVIDER: FactoryProvider =
{
    provide: WEB_SOCKET_HANDLE_STATUS_SUBSCRIBE_MIDDLEWARE,
    useFactory: WebSocketHandleStatusSubscribeMiddlewareFactory,
    deps: [DEFAULT_WEB_SOCKET_HANDLE_STATUS_SUBSCRIBE_MIDDLEWARE]
};