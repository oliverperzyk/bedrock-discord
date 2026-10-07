import type { Snowflake } from "../../models/sdk/data/snowflakes/types/Snowflake"
import type { ISticker } from "../../models/sdk/stickers/base/interfaces/ISticker"
import { StickerType } from "../../models/sdk/stickers/base/enums/StickerType"
import type { IStickerFetchOptions } from "../../models/sdk/stickers/client/interfaces/IStickerFetchOptions"
import type { IGuildStickerCreateOptions } from "../../models/sdk/stickers/client/interfaces/IGuildStickerCreateOptions"
import type { IGuildStickerEditOptions } from "../../models/sdk/stickers/client/interfaces/IGuildStickerEditOptions"
import { DiscordRestClient } from "../client/DiscordRestClient"
import { Routes } from "../globals/Routes"
import { Sticker } from "./Sticker"

/**
 * @summary Manages a guild's custom stickers.
 * @description Implements list, fetch, multipart creation, JSON editing and deletion through a shared authenticated REST client.
 * @example
 * ```ts
 * const client = new DiscordRestClient().setToken("bot-token")
 * const stickers = new GuildStickerManager(client, guildId)
 * const sticker = await stickers.fetch(stickerId)
 * await stickers.edit(stickerId, { name: "Hello", reason: "Update greeting" })
 * // For create(), first configure client.setMultipartUploader(yourUploadAdapter).
 * ```
 */
class GuildStickerManager {
    /**
     * @summary Creates a guild-scoped manager.
     * @description Managers sharing a client and guild also share resource caches.
     * @param client - Shared authenticated REST client.
     * @param guildId - Guild snowflake containing only decimal digits.
     */
    public constructor(
        public readonly client: DiscordRestClient,
        public readonly guildId: Snowflake,
    ) {
        if (typeof guildId !== "string" || !/^\d+$/.test(guildId))
            throw new TypeError("Guild ID must be a decimal snowflake.")
    }

    /**
     * @summary Lists guild stickers.
     * @description Calls GET /guilds/{guild.id}/stickers; uploader fields depend on caller permissions.
     * @param id - Omit to fetch all stickers.
     * @param options - Cache controls.
     * @returns Hydrated stickers or null on request failure.
     */
    public fetch(id?: undefined, options?: IStickerFetchOptions): Promise<readonly Sticker[] | null>
    /**
     * @summary Gets a guild sticker.
     * @description Calls GET /guilds/{guild.id}/stickers/{sticker.id} rather than the global sticker endpoint.
     * @param id - Sticker snowflake.
     * @param options - Cache controls.
     * @returns A sticker or null on request failure.
     */
    public fetch(id: Snowflake, options?: IStickerFetchOptions): Promise<Sticker | null>
    public fetch(id?: Snowflake, options: IStickerFetchOptions = {}): Promise<Sticker | readonly Sticker[] | null> {
        if (id !== undefined) {
            const stickerId = this.resolveId(id)
            const url = Routes.getGuildSticker(this.guildId, stickerId)
            return this.client.fetchResource(
                url,
                async () => {
                    const response = await this.client.get<ISticker>(url)
                    return response.success ? new Sticker(this.client, response.data) : null
                },
                options,
            )
        }
        const url = Routes.getGuildStickers(this.guildId)
        return this.client.fetchResource(
            url,
            async () => {
                const response = await this.client.get<readonly ISticker[]>(url)
                return response.success ? response.data.map((sticker) => new Sticker(this.client, sticker)) : null
            },
            options,
        )
    }

    /**
     * @summary Creates a custom sticker.
     * @description Sends name, description, tags and file through the configured multipart adapter. Discord enforces permissions, guild eligibility, dimensions and animation duration.
     * @param options - Validated metadata and a file of at most 512 KiB.
     * @returns Created sticker or null on upload failure; missing adapter and invalid inputs throw.
     */
    public async create(options: IGuildStickerCreateOptions): Promise<Sticker | null> {
        if (!options || typeof options !== "object") throw new TypeError("Sticker creation options must be an object.")
        this.validateText("name", options.name, 2, 30)
        const description = options.description ?? ""
        if (options.description !== undefined && typeof options.description !== "string")
            throw new TypeError("Sticker description must be a string.")
        if (description !== "") this.validateText("description", description, 2, 100)
        this.validateText("tags", options.tags, 0, 200)
        const file = options.file
        if (!file || !(file.data instanceof Uint8Array)) throw new TypeError("Sticker file data must be a Uint8Array.")
        if (file.data.byteLength === 0 || file.data.byteLength > 512 * 1024)
            throw new RangeError("Sticker file must contain 1 to 524288 bytes (512 KiB).")
        if (typeof file.filename !== "string" || !file.filename.trim() || /[\r\n\0]/.test(file.filename))
            throw new TypeError("Sticker filename must be nonempty and contain no control line breaks.")
        if (!["image/png", "image/apng", "image/gif", "application/json"].includes(file.contentType))
            throw new TypeError("Sticker content type must be PNG, APNG, GIF or Lottie JSON.")
        const response = await this.client.uploadSticker(
            Routes.getGuildStickers(this.guildId),
            {
                name: options.name,
                description,
                tags: options.tags,
            },
            file,
            options.reason,
        )
        if (!response.success) return null
        this.invalidate(response.data.id)
        return new Sticker(this.client, response.data)
    }

    /**
     * @summary Edits a guild sticker.
     * @description Sends only supplied JSON fields; null clears the description. Requires Discord expression permissions.
     * @param stickerOrId - Guild sticker snapshot or snowflake.
     * @param options - Fields to update and optional audit reason.
     * @returns Updated sticker or null on request failure.
     */
    public async edit(
        stickerOrId: Sticker | Snowflake,
        options: IGuildStickerEditOptions = {},
    ): Promise<Sticker | null> {
        const id = this.resolveId(stickerOrId)
        if (!options || typeof options !== "object") throw new TypeError("Sticker edit options must be an object.")
        const body: Record<string, unknown> = {}
        if (options.name !== undefined) {
            this.validateText("name", options.name, 2, 30)
            body.name = options.name
        }
        if (options.description !== undefined) {
            if (options.description !== null) this.validateText("description", options.description, 2, 100)
            body.description = options.description
        }
        if (options.tags !== undefined) {
            this.validateText("tags", options.tags, 0, 200)
            body.tags = options.tags
        }
        const response = await this.client.patch<ISticker>(
            Routes.getGuildSticker(this.guildId, id),
            body,
            options.reason,
        )
        if (!response.success) return null
        this.invalidate(id)
        return new Sticker(this.client, response.data)
    }

    /**
     * @summary Deletes a guild sticker.
     * @description Accepts successful empty responses and invalidates cached guild and global sticker resources.
     * @param stickerOrId - Guild sticker snapshot or snowflake.
     * @param reason - Optional audit log explanation.
     * @returns True on successful deletion, false on transport or API failure.
     */
    public async delete(stickerOrId: Sticker | Snowflake, reason?: string): Promise<boolean> {
        const id = this.resolveId(stickerOrId)
        const response = await this.client.delete(Routes.getGuildSticker(this.guildId, id), reason)
        if (!response.success) return false
        this.invalidate(id)
        return true
    }

    /**
     * @summary Resolves a sticker identifier.
     * @description Rejects standard stickers, known foreign guild stickers and nondecimal IDs before making requests.
     */
    private resolveId(stickerOrId: Sticker | Snowflake): Snowflake {
        if (stickerOrId instanceof Sticker) {
            if (
                stickerOrId.type !== StickerType.GUILD ||
                (stickerOrId.guildId !== undefined && stickerOrId.guildId !== this.guildId)
            )
                throw new TypeError("Sticker must belong to this guild.")
        }
        const id = stickerOrId instanceof Sticker ? stickerOrId.id : stickerOrId
        if (typeof id !== "string" || !/^\d+$/.test(id)) throw new TypeError("Sticker ID must be a decimal snowflake.")
        return id
    }

    /**
     * @summary Validates sticker text.
     * @description Counts Unicode code points to enforce Discord's documented character limits.
     */
    private validateText(field: string, value: string, minimum: number, maximum: number): void {
        if (typeof value !== "string") throw new TypeError(`Sticker ${field} must be a string.`)
        const length = Array.from(value).length
        if (length < minimum || length > maximum)
            throw new RangeError(`Sticker ${field} must contain ${minimum} to ${maximum} characters.`)
    }

    /**
     * @summary Invalidates affected snapshots.
     * @description All managers sharing this client observe invalidation; other guilds and clients retain their caches.
     */
    private invalidate(id: Snowflake): void {
        this.client.invalidateCache(Routes.getGuildStickers(this.guildId))
        this.client.invalidateCache(Routes.getSticker(id))
    }
}

export { GuildStickerManager }
