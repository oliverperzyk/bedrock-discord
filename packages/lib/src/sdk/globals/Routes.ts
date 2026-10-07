import type { Snowflake } from "../../models/sdk/data/snowflakes/types/Snowflake"

/**
 * @summary Routes for the Discord API.
 * @description Class that proivdes all the routes for the Discord API.
 */
class Routes {
    /**
     * @summary Private constructor.
     * @description Prevents instanization & inheritance.
     */
    private constructor() {}

    /**
     * @summary Resolves the URL for the Discord API.
     * @description Resolves the URL for the Discord API by concatenating the base URL with the path and query parameters.
     * @param path - The path of the URL.
     * @param query - The query parameters of the URL.
     * @returns The resolved URL.
     */
    public static resolveUrl(path: string, query: Record<string, string | number | boolean> = {}): string {
        const url = new URL(Routes.DISCORD_API_BASE_URL + path)
        for (const [key, value] of Object.entries(query)) {
            url.searchParams.set(key, value.toString())
        }

        return url.toString()
    }

    /**
     * @summary The base URL of the Discord API.
     * @description Base endpoint of the Discord API, uses latest REST version.
     */
    public static readonly DISCORD_API_BASE_URL: string = "https://discord.com/api/v10"

    /**
     * @summary Gets the webhook with token.
     * @description Gets the webhook with token by concatenating the base URL with the webhook ID and token, used to get a detailed webhook.
     * @param webhookId - The ID of the webhook.
     * @param webhookToken - The token of the webhook.
     * @returns Parsed route for getting webhook with token, used to get a detailed webhook.
     */
    public static getWebhookWithToken(webhookId: Snowflake, webhookToken: string): string {
        return Routes.resolveUrl(`/webhooks/${webhookId}/${webhookToken}`)
    }

    /**
     * @summary Gets a webhook message with token.
     * @description Builds `GET|PATCH|DELETE /webhooks/{webhook.id}/{webhook.token}/messages/{message.id}` with optional `thread_id` and `with_components` query params.
     * @param webhookId - The ID of the webhook.
     * @param webhookToken - The token of the webhook.
     * @param messageId - The ID of the message.
     * @param query - Optional Discord query params (`thread_id`, `with_components`).
     * @returns Parsed route for the webhook message endpoint.
     */
    public static getWebhookMessage(
        webhookId: Snowflake,
        webhookToken: string,
        messageId: Snowflake,
        query: { thread_id?: Snowflake; with_components?: boolean } = {},
    ): string {
        const params: Record<string, string | number | boolean> = {}
        if (query.thread_id !== undefined) params.thread_id = query.thread_id
        if (query.with_components !== undefined) params.with_components = query.with_components
        return Routes.resolveUrl(`/webhooks/${webhookId}/${webhookToken}/messages/${messageId}`, params)
    }
    /**
     * @summary Gets a sticker route.
     * @description Builds the global sticker resource URL.
     * @param stickerId - Sticker snowflake.
     * @returns Discord API URL.
     */
    public static getSticker(stickerId: Snowflake): string {
        return Routes.resolveUrl(`/stickers/${stickerId}`)
    }
    /**
     * @summary Gets the pack listing route.
     * @description Builds the URL for all available standard sticker packs.
     * @returns Discord API URL.
     */
    public static getStickerPacks(): string {
        return Routes.resolveUrl("/sticker-packs")
    }

    /**
     * @summary Gets one pack route.
     * @description Builds the resource URL for a standard sticker pack.
     * @param packId - Pack snowflake.
     * @returns Discord API URL.
     */
    public static getStickerPack(packId: Snowflake): string {
        return Routes.resolveUrl(`/sticker-packs/${packId}`)
    }
}

export { Routes }
