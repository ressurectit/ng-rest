import {IMessage} from '@stomp/stompjs';

import {SubscriptionMetadata} from './webSocketClient.interface.internal';

/**
 * Cache for current connection
 */
const cache: {[key: string]: WebSocketClientPublishCache} = {};

/**
 * Class used for storing cached responses for publish
 */
export class WebSocketClientPublishCache
{
    //######################### private fields #########################

    /**
     * Stored cached responses
     */
    private _responses: {[queue: string]: IMessage[]} = {};

    //######################### public methods #########################

    /**
     * Adds response to cache for specified queue
     * @param queue - Name of queue for which is response stored
     * @param response - Response to be stored
     */
    public addToCache(queue: string, response: IMessage): void
    {
        let responses = this._responses[queue];

        if(!responses)
        {
            responses = [];
            this._responses[queue] = responses;
        }

        responses.push(response);
    }

    /**
     * Replays all responses into output queues
     * @param metadata - Metadata containing subjects
     */
    public replayResponses(metadata: SubscriptionMetadata): void
    {
        Object.keys(this._responses).forEach(queue =>
        {
            const meta = metadata[queue];
            const responses = this._responses[queue];

            if(!meta || !responses)
            {
                return;
            }

            responses.forEach(response => meta.subject.next(response));
            meta.subject.complete();
        });
    }
}

/**
 * Gets cached data if exists
 * @param key - Key used to identifying cache data
 */
export function getCache(key: string): WebSocketClientPublishCache
{
    return cache[key];
}

/**
 * Stores response to cache
 * @param key - Key used to identifying cache data
 * @param queue - Name of queue which response is stored
 * @param response - Response to be cached
 */
export function storeToCache(key: string, queue: string, response: IMessage): void
{
    let cacheObj = cache[key];

    if(!cacheObj)
    {
        cacheObj = new WebSocketClientPublishCache();
        cache[key] = cacheObj;
    }

    cacheObj.addToCache(queue, response);
}