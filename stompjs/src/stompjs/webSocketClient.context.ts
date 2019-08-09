import {generateId, extend, isPresent} from "@jscrpt/common";
import {Client, IMessage} from "@stomp/stompjs";
import {BehaviorSubject, MonoTypeOperatorFunction, Observable} from "rxjs";
import {map, filter} from "rxjs/operators";

import {WebSocketClientResponse} from "./webSocketClient.interface";
import {WebSocketClientResponseOptions, SubscriptionMetadata, WebSocketClientOptions} from "./webSocketClient.interface.internal";
import {RequestType, ResponseType} from "./webSocketClient.types";

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
                private _options: WebSocketClientResponseOptions)
    {
        this._initialize();
    }

    //######################### public methods - implementation of WebSocketClientResponse<any> #########################

    /**
     * Explicitly call publish to queue, can be called only once, if called multiple times, rest of calls do nothing
     */
    public publish()
    {
        if(this._published)
        {
            return;
        }

        this._published = true;
        let options = this._getOptions(this._options.options);
        let body = this._options.body;

        if(isPresent(body) && options.type == RequestType.Json)
        {
            if(isPresent(options.correlationBodyProperty))
            {
                body[options.correlationBodyProperty] = this._correlationId;
            }

            body = JSON.stringify(body);
        }

        this._wsClient.publish(
        {
            destination: `${options.publishQueuePrefix}/${this._options.publish}${this._generateSuffix(options)}`,
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
            Object.keys(this._outputMetadata).forEach(name =>
            {
                let metadata = this._outputMetadata[name];

                if(metadata.subscription)
                {
                    metadata.subscription.unsubscribe();
                    metadata.subscription = null;
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
            let subject = new BehaviorSubject<any>(null);

            this.output[name] = subject
                .asObservable()
                .pipe(this._handleResult(name));

            this._outputMetadata[name] =
            {
                subject: subject
            };
        });

        await this._active;

        Object.keys(this._options.subscribe).forEach(name =>
        {
            let metadata = this._options.subscribe[name];
            let outputMetadata = this._outputMetadata[name];
            let options = this._getOptions(metadata.options);
            
            outputMetadata.subscription = this._wsClient.subscribe(`${options.subscribeQueuePrefix}/${metadata.queueName}${this._generateSuffix(options)}`, data =>
            {
                outputMetadata.subject.next(data);
            });
        });

        if(!this._options.options.delayed)
        {
            this.publish();
        }
    }

    /**
     * Generates suffix according provided options
     * @param options Options to be used for generating suffix
     */
    private _generateSuffix(options: WebSocketClientOptions): string
    {
        let suffix = "";

        if(options.sessionIdSuffix)
        {
            suffix += `/${this._sessionId}`;
        }

        if(options.queueCorrelation)
        {
            suffix += `/${this._correlationId}`;
        }

        return suffix;
    }

    /**
     * Gets options for current publish or subscribe
     * @param options Options for current publish or subscribe to queue
     */
    private _getOptions<TOptions>(options: TOptions): TOptions
    {
        return extend(true, {}, this._options.webSocketOptions, options);
    }

    /**
     * Pipe that is used for handling result
     * @param name Name of subscribe
     */
    private _handleResult: (name: string) => MonoTypeOperatorFunction<any> = name =>
    {
        let metadata = this._options.subscribe[name];
        let options = this._getOptions(metadata.options);

        return (source: Observable<any>) =>
        {
            //filter out result if value was not received using NULL for now
            source = source.pipe(filter(itm => isPresent(itm)));

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

            //filter out non matching results
            if(isPresent(options.correlationBodyProperty) && metadata.producesType == ResponseType.Json)
            {
                source = source.pipe(filter(itm => itm[options.correlationBodyProperty] == this._correlationId));
            }

            //apply response transform
            if(isPresent(metadata.responseTransformFunc))
            {
                source = metadata.responseTransformFunc(source);
            }

            return source;
        };
    };
}