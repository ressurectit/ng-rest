import {isBlank, isPresent, isFunction, extend, isJsObject} from '@jscrpt/common';
import {StompConfig} from '@stomp/stompjs';

import {WebSocketClient} from './webSocketClient';
import {WebSocketClientPublic, SubscribeMetadata, WebSocketClientOptions} from './webSocketClient.interface.internal';
import {ResponseType, RequestType, QueueCorrelationPosition, WEB_SOCKET_HANDLE_RESULT_MIDDLEWARE, WEB_SOCKET_HANDLE_STATUS_SUBSCRIBE_MIDDLEWARE} from './webSocketClient.types';
import {WebSocketClientResponse, SubscribeQueueOptions, PublishQueueOptions, QueueCorrelationOptions} from './webSocketClient.interface';
import {WebSocketClientResponseContext} from './webSocketClient.context';

/**
 * Sets StompJs to use WebSocket instead of SockJS
 */
export function UseWebSocket(): ClassDecorator
{
    return function<TFunction extends Function> (target: TFunction): TFunction
    {
        target.prototype.getConnection = function(this: WebSocketClient): StompConfig
        {
            return {
                brokerURL: this.getBaseUrl()
            };
        };

        return target;
    };
}

/**
 * Sets prefix for publish queue
 * @param prefix - Prefix that is used for each publish to queue
 */
export function PublishQueuePrefix(prefix: string): ClassDecorator
{
    return function<TFunction extends Function> (target: TFunction): TFunction
    {
        target.prototype.getPublishQueuePrefix = function(this: WebSocketClient): string
        {
            return prefix;
        };

        return target;
    };
}

/**
 * All requests will now use correlation id as part of body
 * @param property - Name of property holding correlation id
 */
export function CorrelationBodyProperty(property: string): ClassDecorator
{
    return function<TFunction extends Function> (target: TFunction): TFunction
    {
        target.prototype.getCorrelationBodyProperty = function(this: WebSocketClient): string
        {
            return property;
        };

        return target;
    };
}

/**
 * All requests and responses will now use correlation id as part of requet or response queue name
 */
export function QueueCorrelation(options?: QueueCorrelationOptions): ClassDecorator
{
    options = extend(true, <QueueCorrelationOptions>{position: QueueCorrelationPosition.Suffix, replacementKey: 'corrId'}, options);

    return function<TFunction extends Function> (target: TFunction): TFunction
    {
        target.prototype.useQueueCorrelation = function(this: WebSocketClient): QueueCorrelationOptions
        {
            return options;
        };

        return target;
    };
}

/**
 * All requests and responses will now use session id suffix for all requests and responses
 */
export function UseSessionIdSuffix(): ClassDecorator
{
    return function<TFunction extends Function> (target: TFunction): TFunction
    {
        target.prototype.useSessionIdSuffix = function(this: WebSocketClient): boolean
        {
            return true;
        };

        return target;
    };
}

/**
 * Sets prefix for subscribe queue
 * @param prefix - Prefix that is used for each subscribe from queue
 */
export function SubscribeQueuePrefix(prefix: string): ClassDecorator
{
    return function<TFunction extends Function> (target: TFunction): TFunction
    {
        target.prototype.getSubscribeQueuePrefix = function(this: WebSocketClient): string
        {
            return prefix;
        };

        return target;
    };
}

/**
 * Registers observable to specified queue, this observable is added to WebSocketClientResponse.output
 * @param name - Name of subscription to be subscribed to
 * @param options - Options for subscribe queue
 */
export function SubscribeQueue(name: string, options?: SubscribeQueueOptions)
{
    return function(target: WebSocketClient, _propertyKey: string, descriptor: any)
    {
        if(isBlank(descriptor.subscribeQueue))
        {
            descriptor.subscribeQueue = {};
        }

        let func = null;

        if(options && isPresent(options.responseTransform) && isPresent(target[options.responseTransform]) && isFunction(target[options.responseTransform]))
        {
            func = target[options.responseTransform];
        }

        descriptor.subscribeQueue[name] =
        {
            queueName: (options && isPresent(options.queueName)) ? options.queueName : name,
            producesType: (options && isPresent(options.producesType)) ? options.producesType : ResponseType.Json,
            responseTransformFunc: func,
            options: options
        };

        return descriptor;
    };
}

/**
 * Assigns this method input to publish queue
 * Only one publish per method!
 * @param name - Name of queue to be published to
 * @param options - Options for publish queue
 */
export function PublishQueue(name: string, options?: PublishQueueOptions)
{
    return function(target: WebSocketClient, propertyKey: string, descriptor: any)
    {
        const pPath = target[`${propertyKey}_Path_parameters`];
        const pBody = target[`${propertyKey}_Body_parameters`];
        const pBodyProperty = target[`${propertyKey}_BodyProperty_parameters`];
        const pTransforms: Function[] = target[`${propertyKey}_ParameterTransforms`];

        options = extend(true, {type: RequestType.Json}, options);

        function publishMethod(this: WebSocketClientPublic, ...args: any[]): WebSocketClientResponse<any>
        {
            // build default class options
            const clientBaseOptions: WebSocketClientOptions =
            {
                correlationBodyProperty: this.getCorrelationBodyProperty(),
                publishQueuePrefix: this.getPublishQueuePrefix(),
                queueCorrelation: this.useQueueCorrelation(),
                sessionIdSuffix: this.useSessionIdSuffix(),
                subscribeQueuePrefix: this.getSubscribeQueuePrefix()
            };

            // Body
            let body = null;

            if (pBody)
            {
                body = args[pBody[0].parameterIndex];

                if(pTransforms && pTransforms[pBody[0].parameterIndex])
                {
                    body = pTransforms[pBody[0].parameterIndex].bind(this)(body);
                }
            }

            // Body properties
            if(pBodyProperty)
            {
                if(isBlank(body))
                {
                    body = {};
                }

                for(const x in pBodyProperty)
                {
                    if(pBodyProperty.hasOwnProperty(x))
                    {
                        let bodyProp = args[pBodyProperty[x].parameterIndex];

                        if(pTransforms && pTransforms[pBodyProperty[x].parameterIndex])
                        {
                            bodyProp = pTransforms[pBodyProperty[x].parameterIndex].bind(this)(bodyProp);
                        }

                        body[pBodyProperty[x].key] = bodyProp;
                    }
                }
            }

            // Path
            if (pPath)
            {
                for (const x in pPath)
                {
                    if (pPath.hasOwnProperty(x))
                    {
                        let param = args[pPath[x].parameterIndex];

                        if(pTransforms && pTransforms[pPath[x].parameterIndex])
                        {
                            param = pTransforms[pPath[x].parameterIndex].bind(this)(param);
                        }

                        name = name.replace('{' + pPath[x].key + '}', param);
                    }
                }
            }

            if(isBlank(descriptor.subscribeQueue))
            {
                throw new Error('Missing at least one SubscribeQueue');
            }

            //bind response transform to this
            Object.keys(descriptor.subscribeQueue).forEach(name =>
            {
                const subscribe: SubscribeMetadata = descriptor.subscribeQueue;

                if(isPresent(subscribe[name].responseTransformFunc))
                {
                    subscribe[name].responseTransformFunc = subscribe[name].responseTransformFunc.bind(this);
                }
            });

            return new WebSocketClientResponseContext(this.wsClient,
                                                      this.active,
                                                      this._sessionId,
                                                      {
                                                          subscribe: descriptor.subscribeQueue,
                                                          publish: name,
                                                          body: body,
                                                          options: options,
                                                          webSocketOptions: clientBaseOptions
                                                      },
                                                      this.injector,
                                                      this.logger,
                                                      this.injector.get(WEB_SOCKET_HANDLE_RESULT_MIDDLEWARE),
                                                      this.injector.get(WEB_SOCKET_HANDLE_STATUS_SUBSCRIBE_MIDDLEWARE));
        }

        descriptor.value = publishMethod;

        return descriptor;
    };
}

/**
 * Parameter descriptor that is used for transforming parameter before serialization
 * @param methodName - Name of method that will be called to modify parameter, method takes any type of object and returns transformed object
 */
export function ParameterTransform(methodName?: string)
{
    return function(target: WebSocketClient, propertyKey: string, parameterIndex: number)
    {
        if(isBlank(methodName))
        {
            methodName = `${propertyKey}ParameterTransform`;
        }
        
        if(isPresent(target[methodName!]) && isFunction(target[methodName!]))
        {
            const func = target[methodName!];
            const metadataKey = `${propertyKey}_ParameterTransforms`;
            
            if (!isPresent(target[metadataKey]) || !isJsObject(target[metadataKey]))
            {
                target[metadataKey] = {};
            }
            
            target[metadataKey][parameterIndex] = func;
        }
    };
}

/**
 * Creates param decorator using name of parameter to be created
 */
function paramBuilder(paramName: string)
{
    return function(key: string)
    {
        return function(target: WebSocketClient, propertyKey: string, parameterIndex: number)
        {
            const metadataKey = `${propertyKey}_${paramName}_parameters`;

            const paramObj: any =
            {
                key: key,
                parameterIndex: parameterIndex
            };

            if (Array.isArray(target[metadataKey]))
            {
                target[metadataKey].push(paramObj);
            }
            else
            {
                target[metadataKey] = [paramObj];
            }
        };
    };
}

/**
 * Path variable of a method's url, type: string
 * @param key - Path key to bind value
 */
export const Path = paramBuilder('Path');

/**
 * Body of a REST method, json stringify applied
 * Only one body per method!
 */
export const Body = paramBuilder('Body')('Body');

/**
 * Value of parameter is assigned to body property with specified name
 * @param key - Name of property for this value
 */
export const BodyProperty = paramBuilder('BodyProperty');