import { HttpClient } from "../.."
import { CacheManager } from "../../data/CacheManager"
import type { IRequestResponse } from "../../models/internal/clients/http/interfaces/IRequestResponse"
import type { Snowflake } from "../../models/sdk/data/snowflakes/types/Snowflake"
import type { IMessage } from "../../models/sdk/messages/base/interfaces/IMessage"
import { WebhookType } from "../../models/sdk/webhooks/client/enums/WebhookType"
import type { IEditWebhookMessagePayload } from "../../models/sdk/webhooks/client/interfaces/IEditWebhookMessagePayload"
import type { IModifyWebhookPayload } from "../../models/sdk/webhooks/client/interfaces/IModifyWebhookPayload"
import type { IWebhook } from "../../models/sdk/webhooks/client/interfaces/IWebhook"
import type { IWebhookMessageQuery } from "../../models/sdk/webhooks/client/interfaces/IWebhookMessageQuery"
import { BaseComponent } from "../builders/components/base/BaseComponent"
import { ImageDataManager } from "../data/ImageDataManager"
import { Routes } from "../globals/Routes"

/**
 * @summary Represents a Discord webhook.
 * @description A webhook is a URL that is used to send messages to a channel.
 */
class Webhook {
    /**
     * @summary Cache for webhooks.
     * @description Stores webhooks fetched or updated via with-token endpoints, keyed by webhook URI.
     */
    private static readonly WEBHOOK_CACHE: CacheManager = new CacheManager("webhooks")

    /**
     * @summary Cache for webhook messages.
     * @description Stores messages fetched or updated via with-token message endpoints, keyed by webhook URI, message id, and optional thread id.
     */
    private static readonly MESSAGE_CACHE: CacheManager = new CacheManager("webhook-messages")

    /**
     * @summary Regular expression to validate a Discord webhook URI.
     * @description The regular expression is used to validate a Discord webhook URI.
     */
    private static readonly WEBHOOK_URI_REGEXP: Readonly<RegExp> =
        /^https:\/\/(canary\.|ptb\.)?discord\.com\/api\/webhooks\/\d{17,20}\/[A-Za-z0-9_-]{60,70}$/

    /**
     * @summary Validates a Discord webhook URI.
     * @description Validates a Discord webhook URI by parsing it and checking if it matches the regular expression.
     * @param uri - The URI to validate.
     * @returns True if the URI is a valid Discord webhook URI, false otherwise.
     */
    public static isValidUri(uri: string | URL): uri is URL {
        try {
            const parsedUri: string = uri instanceof URL ? uri.toString() : uri
            return this.WEBHOOK_URI_REGEXP.test(parsedUri)
        } catch {
            return false
        }
    }

    /**
     * @summary The endpoint of the webhook.
     * @description The endpoint of the webhook is the URL that is used to send messages to the webhook.
     */
    public readonly uri: string

    /**
     * @summary Internal snowflake identifier of the webhook.
     * @description Internal snowflake identifier of the webhook, used to allow user to make more detailed requests about the webhook.
     */
    private internalId: Snowflake | null = null

    /**
     * @summary Internal token of the webhook.
     * @description Internal token of the webhook, used to allow user to make more detailed requests about the webhook.
     */
    private internalToken: string | null = null

    /**
     * @summary Creates a new webhook.
     * @description Creates an instance of a Discord webhook, that is in demand for sending messages to a channel.
     * @param uri - Endpoint of the webhook.
     * @remarks This does not verify whenever the webhook is valid, use {@link Webhook.isValid} to verify it.
     */
    public constructor(uri: string | URL) {
        if (!Webhook.isValidUri(uri)) throw new URIError("Invalid webhook URI while initializing Webhook instance.")
        this.uri = uri instanceof URL ? uri.toString() : uri
    }

    /**
     * @summary Checks if the webhook is valid.
     * @description Checks if the webhook is valid by making a request to the webhook endpoint and checking if the response is successful.
     * @param cache - Whenever to use the cache to check if the webhook is valid.
     * @returns Whenever the webhook is valid.
     */
    public async isValid(cache: boolean = true): Promise<boolean> {
        try {
            const webhook: IWebhook<false> | null = await this.getWebhook(cache)
            return webhook !== null
        } catch {
            return false
        }
    }

    /**
     * @summary Gets the webhook.
     * @description Gets the webhook by making a request to the webhook endpoint and checking if the response is successful.
     * @param cache - Whenever to use the cache to get the webhook.
     * @returns The webhook, or `null` if the webhook is not found.
     */
    public async getWebhook(cache: boolean = true): Promise<IWebhook<false> | null> {
        try {
            const cachedWebhook: IWebhook<false> | null | undefined = cache
                ? Webhook.WEBHOOK_CACHE.get<IWebhook<false> | null>(this.uri)
                : undefined
            if (cache && cachedWebhook !== undefined) return cachedWebhook
            const response: IRequestResponse<IWebhook<false>> = await HttpClient.get(this.uri)
            if (response.success) {
                const webhook: IWebhook<false> = response.data
                if (cache) Webhook.WEBHOOK_CACHE.set(this.uri, webhook)
                return webhook
            }

            Webhook.WEBHOOK_CACHE.set(this.uri, null)
            return null
        } catch {
            return null
        }
    }

    /**
     * @summary Gets the detailed webhook.
     * @description Gets the detailed webhook by making a request to the webhook endpoint and checking if the response is successful.
     * @param cache - Whenever to use the cache to get the detailed webhook.
     * @returns The detailed webhook, or `null` if the detailed webhook is not found.
     */
    public async getDetailedWebhook(cache: boolean = true): Promise<IWebhook<true> | null> {
        try {
            if (this.internalId === null) {
                const baseWebhook: IWebhook<false> | null = await this.getWebhook(cache)
                if (baseWebhook === null) return null
                this.internalId = baseWebhook.id
                this.internalToken = baseWebhook.type === WebhookType.INCOMING ? baseWebhook.token! : null
            }

            const cachedDetailedWebhook: IWebhook<true> | null | undefined = cache
                ? Webhook.WEBHOOK_CACHE.get<IWebhook<true> | null>(this.uri)
                : undefined
            if (cache && cachedDetailedWebhook !== undefined) return cachedDetailedWebhook
            if (this.internalToken !== null) {
                const response: IRequestResponse<IWebhook<true>> = await HttpClient.get<IWebhook<true>>(
                    Routes.getWebhookWithToken(this.internalId, this.internalToken),
                )
                if (response.success) {
                    const detailedWebhook: IWebhook<true> = response.data
                    if (cache) Webhook.WEBHOOK_CACHE.set(this.uri, detailedWebhook)
                    return detailedWebhook
                }
            }

            return null
        } catch {
            return null
        }
    }

    /**
     * @summary Gets the id of the webhook.
     * @description Gets the id of the webhook by making a request to the webhook endpoint and checking if the response is successful.
     * @returns The id of the webhook, or `null` if the id is not found.
     */
    public async getId(): Promise<Snowflake | null> {
        try {
            if (this.internalId !== null) return this.internalId
            const webhook: IWebhook<false> | null = await this.getWebhook()
            if (webhook === null) return null
            this.internalId = webhook.id
            return webhook.id
        } catch {
            return null
        }
    }

    /**
     * @summary Gets the token of the webhook.
     * @description Gets the token of the webhook by making a request to the webhook endpoint and checking if the response is successful.
     * @returns The token of the webhook, or `null` if the token is not found.
     */
    public async getToken(): Promise<string | null> {
        try {
            if (this.internalToken !== null) return this.internalToken
            const webhook: IWebhook<false> | null = await this.getWebhook()
            if (webhook === null || webhook.type !== WebhookType.INCOMING) return null
            this.internalToken = webhook.token ?? null
            return this.internalToken
        } catch {
            return null
        }
    }

    /**
     * @summary Modifies the webhook with its token.
     * @description Calls `PATCH /webhooks/{webhook.id}/{webhook.token}`. Does not accept `channel_id`. Avatar strings must be Discord image data.
     * @param payload - Optional name and avatar to update.
     * @returns The updated webhook, or `null` if the request failed.
     */
    public async modify(payload: IModifyWebhookPayload): Promise<IWebhook<false> | null> {
        try {
            if (
                payload.avatar !== undefined &&
                payload.avatar !== null &&
                !ImageDataManager.isImageData(payload.avatar)
            ) {
                throw new TypeError("Webhook avatar must be Discord image data or null.")
            }

            const credentials: { id: Snowflake; token: string } | null = await this.resolveCredentials()
            if (credentials === null) return null

            const body: Record<string, unknown> = {}
            if (payload.name !== undefined) body.name = payload.name
            if (payload.avatar !== undefined) body.avatar = payload.avatar

            const response: IRequestResponse<IWebhook<false>> = await HttpClient.patch<IWebhook<false>>(
                Routes.getWebhookWithToken(credentials.id, credentials.token),
                undefined,
                { body },
            )
            if (!response.success) return null

            Webhook.WEBHOOK_CACHE.set(this.uri, response.data)
            return response.data
        } catch (error: unknown) {
            if (error instanceof TypeError) throw error
            return null
        }
    }

    /**
     * @summary Deletes the webhook with its token.
     * @description Calls `DELETE /webhooks/{webhook.id}/{webhook.token}` and clears the local cache entry on success.
     * @returns `true` if the webhook was deleted, otherwise `false`.
     */
    public async delete(): Promise<boolean> {
        try {
            const credentials: { id: Snowflake; token: string } | null = await this.resolveCredentials()
            if (credentials === null) return false

            const response: IRequestResponse = await HttpClient.delete(
                Routes.getWebhookWithToken(credentials.id, credentials.token),
            )
            if (!response.success) return false

            Webhook.WEBHOOK_CACHE.delete(this.uri)
            this.internalId = null
            this.internalToken = null
            return true
        } catch {
            return false
        }
    }

    /**
     * @summary Gets a previously sent webhook message.
     * @description Calls `GET /webhooks/{webhook.id}/{webhook.token}/messages/{message.id}`. Uses {@link Webhook.MESSAGE_CACHE} when `cache` is true.
     * @param messageId - Snowflake of the message created by this webhook.
     * @param query - Optional thread id when the message is in a thread.
     * @param cache - Whether to read from and write to the message cache. Defaults to `true`.
     * @returns The message, or `null` if the request failed.
     */
    public async getMessage(
        messageId: Snowflake,
        query: IWebhookMessageQuery = {},
        cache: boolean = true,
    ): Promise<IMessage | null> {
        try {
            const cacheKey: string = this.messageCacheKey(messageId, query.threadId)
            const cachedMessage: IMessage | null | undefined = cache
                ? Webhook.MESSAGE_CACHE.get<IMessage | null>(cacheKey)
                : undefined
            if (cache && cachedMessage !== undefined) return cachedMessage

            const credentials: { id: Snowflake; token: string } | null = await this.resolveCredentials()
            if (credentials === null) return null

            const response: IRequestResponse<IMessage> = await HttpClient.get<IMessage>(
                Routes.getWebhookMessage(credentials.id, credentials.token, messageId, {
                    thread_id: query.threadId,
                }),
            )
            if (response.success) {
                if (cache) Webhook.MESSAGE_CACHE.set(cacheKey, response.data)
                return response.data
            }

            if (cache) Webhook.MESSAGE_CACHE.set(cacheKey, null)
            return null
        } catch {
            return null
        }
    }

    /**
     * @summary Edits a previously sent webhook message.
     * @description Calls `PATCH /webhooks/{webhook.id}/{webhook.token}/messages/{message.id}` with a JSON body. Does not upload multipart files. Updates the message cache on success.
     * @param messageId - Snowflake of the message created by this webhook.
     * @param payload - Fields to update; every field is optional and nullable.
     * @param query - Optional thread id and `with_components` flag.
     * @returns The updated message, or `null` if the request failed.
     */
    public async editMessage(
        messageId: Snowflake,
        payload: IEditWebhookMessagePayload,
        query: IWebhookMessageQuery = {},
    ): Promise<IMessage | null> {
        try {
            const credentials: { id: Snowflake; token: string } | null = await this.resolveCredentials()
            if (credentials === null) return null

            const body: Record<string, unknown> = {}
            if (payload.content !== undefined) body.content = payload.content
            if (payload.embeds !== undefined) body.embeds = payload.embeds
            if (payload.flags !== undefined) body.flags = payload.flags
            if (payload.allowedMentions !== undefined) body.allowed_mentions = payload.allowedMentions
            if (payload.attachments !== undefined) body.attachments = payload.attachments
            if (payload.poll !== undefined) body.poll = payload.poll
            if (payload.components !== undefined) {
                body.components =
                    payload.components === null
                        ? null
                        : payload.components.map((component: BaseComponent) => component.toJSON())
            }

            const response: IRequestResponse<IMessage> = await HttpClient.patch<IMessage>(
                Routes.getWebhookMessage(credentials.id, credentials.token, messageId, {
                    thread_id: query.threadId,
                    with_components: query.withComponents,
                }),
                undefined,
                { body },
            )
            if (!response.success) return null

            Webhook.MESSAGE_CACHE.set(this.messageCacheKey(messageId, query.threadId), response.data)
            return response.data
        } catch {
            return null
        }
    }

    /**
     * @summary Deletes a previously sent webhook message.
     * @description Calls `DELETE /webhooks/{webhook.id}/{webhook.token}/messages/{message.id}` and removes the matching message cache entry on success.
     * @param messageId - Snowflake of the message created by this webhook.
     * @param query - Optional thread id when the message is in a thread.
     * @returns `true` if the message was deleted, otherwise `false`.
     */
    public async deleteMessage(messageId: Snowflake, query: IWebhookMessageQuery = {}): Promise<boolean> {
        try {
            const credentials: { id: Snowflake; token: string } | null = await this.resolveCredentials()
            if (credentials === null) return false

            const response: IRequestResponse = await HttpClient.delete(
                Routes.getWebhookMessage(credentials.id, credentials.token, messageId, {
                    thread_id: query.threadId,
                }),
            )
            if (!response.success) return false

            Webhook.MESSAGE_CACHE.delete(this.messageCacheKey(messageId, query.threadId))
            return true
        } catch {
            return false
        }
    }

    /**
     * @summary Resolves webhook id and token for with-token routes.
     * @description Uses cached credentials when present, otherwise loads them via {@link Webhook.getId} and {@link Webhook.getToken}.
     * @returns The id and token pair, or `null` when either is unavailable.
     */
    private async resolveCredentials(): Promise<{ id: Snowflake; token: string } | null> {
        const id: Snowflake | null = await this.getId()
        const token: string | null = await this.getToken()
        if (id === null || token === null) return null
        return { id, token }
    }

    /**
     * @summary Builds a message cache key.
     * @description Combines this webhook URI, message id, and optional thread id so thread-scoped fetches do not collide.
     * @param messageId - Snowflake of the message.
     * @param threadId - Optional thread snowflake from the query.
     * @returns The cache key string.
     */
    private messageCacheKey(messageId: Snowflake, threadId?: Snowflake): string {
        return `${this.uri}:${messageId}:${threadId ?? ""}`
    }
}

export { Webhook }
