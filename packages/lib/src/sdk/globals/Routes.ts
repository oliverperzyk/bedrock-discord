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
}

export { Routes }
