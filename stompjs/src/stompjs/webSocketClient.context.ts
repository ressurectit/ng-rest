import {Injector} from '@angular/core';
import {Logger} from '@anglr/common';
import {generateId, extend, isPresent} from '@jscrpt/common';
import {Client} from '@stomp/stompjs';
import {tap} from 'rxjs/operators';
import {ReplaySubject, MonoTypeOperatorFunction, Observable} from 'rxjs';

import {WebSocketClientResponse, StatusQueueResponse, WebSocketHandleResultMiddleware, WebSocketHandleStatusSubscribeMiddleware, PublishQueueOptions} from './webSocketClient.interface';
import {WebSocketClientResponseOptions, SubscriptionMetadata, WebSocketClientOptions} from './webSocketClient.interface.internal';
import {RequestType, QueueCorrelationPosition} from './webSocketClient.types';
import {getCache, storeToCache} from './webSocketClinet.cache';

const DEFAULT_STATUS_MAPPING = (value: any) => value;

//TODO - skipSubscription think if it is possible
//TODO - test properly ngDevMode

const WS_DEBUG_OPTIONS =
{
    request: false,
    responseSubscribe: false,
    responseRaw: false,
    response: false
};

/**
 * Represents response for websocket request
 */
export class WebSocketClientResponseContext implements WebSocketClientResponse<any>
{
    //######################### private fields #########################

    /**
     * Correlation id that helps to match request and response
     */
    private _correlationId = generateId(16);

    /**
     * Metadata for output queues
     */
    private _outputMetadata: SubscriptionMetadata = {};

    /**
     * Object holding output observables for each subscribed queue
     */
    private _output: any = {};

    /**
     * Indication whether publish was called
     */
    private _published: boolean = false;

    /**
     * Key used to identifying cache
     */
    private _cacheKey!: string;

    //######################### public properties - implementation of WebSocketClientResponse<any> #########################

    /**
     * Object holding output observables for each subscribed queue
     */
    public get output(): any
    {
        return this._output;
    }

    //######################### constructor #########################
    constructor(private _wsClient: Client,
                private _active: Promise<void>,
                private _sessionId: string,
                private _options: WebSocketClientResponseOptions,
                private _injector: Injector,
                private _logger: Logger,
                private _handleResultMiddlewares: WebSocketHandleResultMiddleware[],
                private _handleStatusMiddlewares: WebSocketHandleStatusSubscribeMiddleware[])
    {
        this._logger.verbose(`WebSocket: socket context "{sessionId}" correlationId "${this._correlationId}"`, this._sessionId);

        this._initialize();
    }

    //######################### public methods - implementation of WebSocketClientResponse<any> #########################

    /**
     * Explicitly call publish to queue, can be called only once, if called multiple times, rest of calls do nothing
     */
    public publish(): void
    {
        if(this._published)
        {
            return;
        }

        this._published = true;
        const options = this._getOptions(this._options.options);
        let body = this._options.body;

        if(options?.cacheResponse)
        {
            this._cacheKey = this._buildCacheKey(options.publishQueuePrefix!, this._options.publish, options.cacheResponse(body));
        }

        if(isPresent(body) && options?.type == RequestType.Json)
        {
            if(isPresent(options.correlationBodyProperty))
            {
                (body as any)[options.correlationBodyProperty] = this._correlationId;
            }

            body = JSON.stringify(body);
        }

        if(options?.cacheResponse)
        {
            const cache = getCache(this._cacheKey);

            if(cache)
            {
                cache.replayResponses(this._outputMetadata);

                return;
            }
        }

        this._logger.debug(`WebSocket: sending request to '${this._options.publish}' with '${body}'`);

        jsDevMode && WS_DEBUG_OPTIONS.request && console.log(`DEBUG REQUEST ${this._generateQueuePublishUrl(options?.publishQueuePrefix, this._options.publish, options)} => ${body}`);

        this._wsClient.publish(
        {
            destination: this._generateQueuePublishUrl(options?.publishQueuePrefix, this._options.publish, options),
            body: body as string
        });
    }

    /**
     * Destroys currently registered listeners for response
     */
    public destroy()
    {
        if(this._outputMetadata)
        {
            this._logger.verbose(`WebSocket: context is being destroyed "{sessionId}" correlationId "${this._correlationId}"`, this._sessionId);

            Object.keys(this._outputMetadata).forEach(name =>
            {
                const metadata = this._outputMetadata[name];

                if(metadata.subscription)
                {
                    metadata.subscription.unsubscribe();
                    metadata.subscription = null!;
                }

                if(metadata.subject)
                {
                    metadata.subject.complete();
                }
            });
        }
    }

    //######################### private methods #########################

    /**
     * Initialize response
     */
    private async _initialize()
    {
        Object.keys(this._options.subscribe).forEach(name =>
        {
            const subject = new ReplaySubject<any>();

            this.output[name] = subject
                .asObservable()
                .pipe(this._handleResult(name));

            this._outputMetadata[name] =
            {
                subject: subject
            };
        });

        const publishOptions = this._getOptions(this._options.options);

        await this._active;

        Object.keys(this._options.subscribe).forEach(name =>
        {
            const metadata = this._options.subscribe[name];
            const outputMetadata = this._outputMetadata[name];
            const options = this._getOptions(metadata.options);

            outputMetadata.subscription = this._wsClient.subscribe(this._generateQueuePublishUrl(options?.subscribeQueuePrefix, metadata.queueName, options), data =>
            {
                this._logger.debug(`WebSocket: subscription "${this._sessionId}", queue "${name}", data "${data.body}"`);
                jsDevMode && WS_DEBUG_OPTIONS.responseSubscribe && console.log(`DEBUG SUBSCRIBE RAW ${this._generateQueuePublishUrl(publishOptions?.publishQueuePrefix, this._options.publish, publishOptions)} => ${name}`, data.body);

                if(publishOptions?.cacheResponse)
                {
                    storeToCache(this._cacheKey, name, data);
                }

                //handle status queue
                if(options?.statusQueue)
                {
                    let statusData: any = data.body;

                    try
                    {
                        statusData = JSON.parse(data.body);
                    }
                    catch(e)
                    {
                        console.warn(`Failed to deserialize status response, ${e}`);
                        statusData = {};
                    }

                    const status: StatusQueueResponse = options.statusQueueMapping ? options.statusQueueMapping(statusData) : DEFAULT_STATUS_MAPPING(statusData);
                    // status.original = data;

                    this._handleStatusMiddlewares.forEach(middleware =>
                    {
                        middleware(status, metadata, options, publishOptions!, this._outputMetadata[status.queue!], this._injector, this._correlationId, name);
                    });
                }

                outputMetadata.subject.next(data);

                if(options?.singleResponse)
                {
                    outputMetadata.subject.complete();
                }
            });
        });

        if(!this._options.options?.delayed)
        {
            this.publish();
        }
    }

    /**
     * Builds cache key
     */
    private _buildCacheKey(prefix: string, name: string, id: string)
    {
        return `${prefix}/${name}-${id}`;
    }

    /**
     *
     * @param prefix - Fixed prefix for publish/subscribe url
     * @param name - Name of publish/subscribe
     * @param options - Options for publish/subscribe
     */
    private _generateQueuePublishUrl(prefix?: string, name?: string, options?: WebSocketClientOptions)
    {
        if(options?.queueCorrelation && options.queueCorrelation.position == QueueCorrelationPosition.Prefix)
        {
            prefix = `${prefix}/${this._correlationId}`;
        }

        let url = `${prefix}/${name}${this._generateSuffix(options!)}`;

        if(options?.queueCorrelation && options.queueCorrelation.position == QueueCorrelationPosition.Replace)
        {
            url = url.replace(`{${options.queueCorrelation.replacementKey}}`, this._correlationId);
        }

        return url;
    }

    /**
     * Generates suffix according provided options
     * @param options - Options to be used for generating suffix
     */
    private _generateSuffix(options: WebSocketClientOptions): string
    {
        let suffix = '';

        if(options.sessionIdSuffix)
        {
            suffix += `/${this._sessionId}`;
        }

        if(options.queueCorrelation && options.queueCorrelation.position == QueueCorrelationPosition.Suffix)
        {
            suffix += `/${this._correlationId}`;
        }

        return suffix;
    }

    /**
     * Gets options for current publish or subscribe
     * @param options - Options for current publish or subscribe to queue
     */
    private _getOptions<TOptions>(options: TOptions): TOptions
    {
        return extend(true, {}, this._options.webSocketOptions, options);
    }

    /**
     * Pipe that is used for handling result
     * @param name - Name of subscribe
     */
    private _handleResult: (name: string) => MonoTypeOperatorFunction<any> = name =>
    {
        const metadata = this._options.subscribe[name];
        const options = this._getOptions(metadata.options);
        const publishOptions = (jsDevMode && this._getOptions(this._options.options)) as PublishQueueOptions | undefined;

        return (source: Observable<any>) =>
        {
            if(jsDevMode && WS_DEBUG_OPTIONS.responseRaw)
            {
                source = source.pipe(tap(data =>
                {
                    console.log(`DEBUG RAW ${this._generateQueuePublishUrl(publishOptions?.publishQueuePrefix, this._options.publish, publishOptions)} => ${name}`, data.body);
                }));
            }

            this._handleResultMiddlewares.forEach(middleware =>
            {
                source = middleware(source, metadata, options!, publishOptions!, this._injector, this._correlationId, name);
            });

            if(jsDevMode && WS_DEBUG_OPTIONS.response)
            {
                source = source.pipe(tap(data =>
                {
                    console.log(`DEBUG ${this._generateQueuePublishUrl(publishOptions?.publishQueuePrefix, this._options.publish, publishOptions)} => ${name}`, data);
                }));
            }

            return source;
        };
    };
}