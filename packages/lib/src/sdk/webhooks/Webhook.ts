import { HttpClient } from "../.."
import { CacheManager } from "../../data/CacheManager"
import type { IRequestResponse } from "../../models/internal/clients/http/interfaces/IRequestResponse"
import type { Snowflake } from "../../models/sdk/data/snowflakes/types/Snowflake"
import { WebhookType } from "../../models/sdk/webhooks/client/enums/WebhookType"
import type { IWebhook } from "../../models/sdk/webhooks/client/interfaces/IWebhook"
import { Routes } from "../globals/Routes"

/**
 * @summary Represents a Discord webhook.
 * @description A webhook is a URL that is used to send messages to a channel.
 */
class Webhook {
    private static readonly WEBHOOK_CACHE: CacheManager = new CacheManager("webhooks")

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
            return webhook?.id ?? null
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
            return webhook?.type === WebhookType.INCOMING ? webhook.token! : null
        } catch {
            return null
        }
    }
}

export { Webhook }
