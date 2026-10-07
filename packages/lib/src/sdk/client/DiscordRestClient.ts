import type { ISticker } from "../../models/sdk/stickers/base/interfaces/ISticker"
import type { IStickerFile } from "../../models/sdk/stickers/client/interfaces/IStickerFile"
import type { StickerMultipartUploader } from "../../models/sdk/stickers/client/types/StickerMultipartUploader"
import type { HttpHeader } from "@minecraft/server-net"
import { HttpClient } from "../../internal/clients/HttpClient"
import type { IRequestResponse } from "../../models/internal/clients/http/interfaces/IRequestResponse"
import type { IStickerFetchOptions } from "../../models/sdk/stickers/client/interfaces/IStickerFetchOptions"

/**
 * @summary Authenticated Discord REST client.
 * @description Owns a bot token and resource caches while delegating JSON requests to the Bedrock HTTP transport.
 * @example
 * ```ts
 * const client = new DiscordRestClient().setToken("bot-token")
 * const sticker = await Sticker.fetch(client, stickerId)
 * ```
 */
class DiscordRestClient {
    /**
     * @summary Bot credentials.
     * @description Stored on this client and used only to construct authenticated request headers.
     */
    private token: string | null = null

    /**
     * @summary Resource cache.
     * @description Shared by resources using this client, never by separate clients.
     */
    private readonly resources = new Map<string, unknown>()

    /**
     * @summary Cache generation.
     * @description Prevents requests started before invalidation from restoring stale entries.
     */
    private generation = 0

    /**
     * @summary Binary upload transport.
     * @description Optional adapter for multipart files unsupported by the Bedrock HTTP string-body API.
     */
    private multipartUploader: StickerMultipartUploader | null = null

    /**
     * @summary Configures binary sticker uploads.
     * @description The adapter owns multipart encoding and delivery; normal JSON routes still use HttpClient.
     * @param uploader - Transport that sends the file bytes without conversion to a string.
     * @returns This client for chaining.
     */
    public setMultipartUploader(uploader: StickerMultipartUploader): this {
        if (typeof uploader !== "function") throw new TypeError("Multipart uploader must be a function.")
        this.multipartUploader = uploader
        return this
    }

    /**
     * @summary Sends a sticker upload.
     * @description Requires an upload adapter; passes separate form fields and exact file bytes without JSON serialization.
     * @param url - Guild sticker creation URL.
     * @param fields - Name, description and tags form fields.
     * @param file - File metadata and binary contents.
     * @param reason - Optional audit reason.
     * @returns Upload response; adapter exceptions become failed response envelopes.
     */
    public async uploadSticker(
        url: string,
        fields: Readonly<Record<string, string>>,
        file: IStickerFile,
        reason?: string,
    ): Promise<IRequestResponse<ISticker>> {
        const headers = this.getHeaders(reason)
        if (this.multipartUploader === null)
            throw new TypeError(
                "Configure a multipart upload adapter with DiscordRestClient.setMultipartUploader before creating stickers.",
            )
        try {
            return await this.multipartUploader({ url, method: "POST", headers, fields, file })
        } catch (error: unknown) {
            return { success: false, statusCode: 0, headers: [], error }
        }
    }

    /**
     * @summary Configures authentication.
     * @description Accepts a raw bot token or a Bot-prefixed token; changing credentials clears cached resources.
     * @param token - Discord bot token.
     * @returns This client for chaining.
     */
    public setToken(token: string): this {
        if (typeof token !== "string") throw new TypeError("Bot token must be a string.")
        const normalized = token.replace(/^Bot\s+/i, "").trim()
        if (!normalized || /\s/.test(normalized))
            throw new TypeError("Bot token must be nonempty and contain no whitespace.")
        if (this.token !== normalized) {
            this.token = normalized
            this.invalidateCache()
        }
        return this
    }

    /**
     * @summary Builds authenticated headers.
     * @description Requires a configured token and encodes an optional audit reason for Discord.
     * @param reason - Human-readable audit log reason.
     * @returns Headers ready for the HTTP transport.
     */
    public getHeaders(reason?: string): HttpHeader[] {
        if (this.token === null) throw new TypeError("Configure a bot token with DiscordRestClient.setToken first.")
        const headers: HttpHeader[] = [{ key: "Authorization", value: `Bot ${this.token}` }]
        if (reason !== undefined) {
            if (typeof reason !== "string") throw new TypeError("Audit reason must be a string.")
            headers.push({ key: "X-Audit-Log-Reason", value: encodeURIComponent(reason) })
        }
        return headers
    }

    /**
     * @summary Fetches a JSON resource.
     * @description Authentication is added per request without modifying global HttpClient state.
     * @param url - Discord API URL.
     * @returns Transport response including success or failure.
     */
    public get<D>(url: string): Promise<IRequestResponse<D>> {
        return this.request<D>("get", url)
    }

    /**
     * @summary Creates a JSON resource.
     * @description Sends an authenticated POST through the existing transport.
     * @param url - Discord API URL.
     * @param body - JSON payload.
     * @param reason - Optional audit reason.
     * @returns Transport response including success or failure.
     */
    public post<D>(url: string, body: unknown, reason?: string): Promise<IRequestResponse<D>> {
        return this.request<D>("post", url, body, reason)
    }

    /**
     * @summary Updates a JSON resource.
     * @description Sends an authenticated PATCH with an optional audit header.
     * @param url - Discord API URL.
     * @param body - JSON payload.
     * @param reason - Optional audit reason.
     * @returns Transport response including success or failure.
     */
    public patch<D>(url: string, body: unknown, reason?: string): Promise<IRequestResponse<D>> {
        return this.request<D>("patch", url, body, reason)
    }

    /**
     * @summary Deletes a resource.
     * @description Preserves successful responses with empty bodies, including HTTP 204.
     * @param url - Discord API URL.
     * @param reason - Optional audit reason.
     * @returns Transport response including success or failure.
     */
    public delete(url: string, reason?: string): Promise<IRequestResponse> {
        return this.request("delete", url, undefined, reason)
    }

    /**
     * @summary Loads a client-cached resource.
     * @description Stores successful non-null results only; force skips reads and cache=false skips both reads and writes.
     * @param key - API URL identifying the resource.
     * @param load - Resource loader returning null on transport failure.
     * @param options - Cache controls.
     * @returns Cached or loaded resource, or null on failure.
     */
    public async fetchResource<T>(
        key: string,
        load: () => Promise<T | null>,
        options: IStickerFetchOptions = {},
    ): Promise<T | null> {
        this.getHeaders()
        const cache = options.cache ?? true
        if (cache && !options.force && this.resources.has(key)) return this.resources.get(key) as T
        const generation = this.generation
        const value = await load()
        if (cache && value !== null && generation === this.generation) this.resources.set(key, value)
        return value
    }

    /**
     * @summary Invalidates resource entries.
     * @description Removes URLs starting with a prefix, or all entries when called without a prefix.
     * @param prefix - Resource URL prefix to invalidate.
     */
    public invalidateCache(prefix: string = ""): void {
        this.generation++
        for (const key of this.resources.keys()) {
            if (key.startsWith(prefix)) this.resources.delete(key)
        }
    }

    /**
     * @summary Delegates a JSON request.
     * @description Local configuration errors throw; transport exceptions become failed response envelopes.
     */
    private async request<D>(
        method: "get" | "post" | "patch" | "delete",
        url: string,
        body?: unknown,
        reason?: string,
    ): Promise<IRequestResponse<D>> {
        const headers = this.getHeaders(reason)
        if (body !== undefined) headers.push({ key: "Content-Type", value: "application/json" })
        try {
            return await HttpClient[method]<D>(url, headers, { body })
        } catch (error: unknown) {
            return { success: false, statusCode: 0, headers: [], error }
        }
    }
}

export { DiscordRestClient }
