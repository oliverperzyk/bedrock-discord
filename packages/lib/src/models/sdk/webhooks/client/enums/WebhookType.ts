/**
 * @summary An enum representing the type of a webhook.
 * @description Allows to distinguish between different types of webhooks.
 */
enum WebhookType {
    /**
     * @summary An incoming webhook.
     * @description Incoming Webhooks can post messages to channels with a generated token.
     */
    INCOMING = 1,
    /**
     * @summary A channel follower webhook.
     * @description Channel Follower Webhooks are internal webhooks used with Channel Following to receive events from channels.
     */
    CHANNEL_FOLLOWER = 2,
    /**
     * @summary A application webhook.
     * @description Application webhooks are webhooks used with interactions.
     */
    APPLICATION = 3,
}

export { WebhookType }
