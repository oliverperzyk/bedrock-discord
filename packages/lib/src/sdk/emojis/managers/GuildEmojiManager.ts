import {
    assertEmojiId,
    assertEmojiImage,
    assertEmojiName,
    assertEmojiRoles,
} from "../../../internal/emojis/EmojiValidation"
import type { Snowflake } from "../../../models/sdk/data/snowflakes/types/Snowflake"
import type { IEmoji } from "../../../models/sdk/emojis/base/interfaces/IEmoji"
import type { IResourceFetchOptions } from "../../../models/sdk/client/interfaces/IResourceFetchOptions"
import type { IGuildEmojiCreateOptions } from "../../../models/sdk/emojis/client/interfaces/IGuildEmojiCreateOptions"
import type { IGuildEmojiEditOptions } from "../../../models/sdk/emojis/client/interfaces/IGuildEmojiEditOptions"
import { DiscordRestClient } from "../../client/DiscordRestClient"
import { Routes } from "../../globals/Routes"
import { Emoji } from "../Emoji"

/**
 * @summary Manages custom guild emojis.
 * @description Implements all five guild emoji endpoints using authenticated JSON requests and client-local caches.
 * @example
 * ```ts
 * const emojis = new GuildEmojiManager(client, guildId)
 * const created = await emojis.create({ name: "wave", image: imageData })
 * if (created) await emojis.edit(created, { name: "hello", reason: "Rename greeting" })
 * ```
 */
class GuildEmojiManager {
    /**
     * @summary Creates a guild manager.
     * @description Binds emoji operations and cache keys to one decimal guild identifier.
     * @param client - Shared authenticated REST client.
     * @param guildId - Owning guild snowflake.
     */
    public constructor(
        public readonly client: DiscordRestClient,
        public readonly guildId: Snowflake,
    ) {
        assertEmojiId(guildId)
    }

    /**
     * @summary Lists guild emojis.
     * @description Calls GET on the guild emoji collection; an empty successful array is preserved.
     * @param id - Omit to list all emojis.
     * @param options - Cache controls.
     * @returns Emoji snapshots, or null on request failure.
     */
    public fetch(id?: undefined, options?: IResourceFetchOptions): Promise<readonly Emoji[] | null>
    /**
     * @summary Gets one guild emoji.
     * @description Calls the guild item route, where uploader information depends on permissions.
     * @param id - Custom emoji snowflake.
     * @param options - Cache controls.
     * @returns Emoji snapshot, or null on request failure.
     */
    public fetch(id: Snowflake, options?: IResourceFetchOptions): Promise<Emoji | null>
    public fetch(id?: Snowflake, options: IResourceFetchOptions = {}): Promise<Emoji | readonly Emoji[] | null> {
        if (id !== undefined) {
            assertEmojiId(id)
            const url = Routes.getGuildEmoji(this.guildId, id)
            return this.client.fetchResource(
                url,
                async () => {
                    const response = await this.client.get<IEmoji>(url)
                    return response.success ? new Emoji(this.client, response.data, this.guildId) : null
                },
                options,
            )
        }
        const url = Routes.getGuildEmojis(this.guildId)
        return this.client.fetchResource(
            url,
            async () => {
                const response = await this.client.get<readonly IEmoji[]>(url)
                return response.success ? response.data.map((data) => new Emoji(this.client, data, this.guildId)) : null
            },
            options,
        )
    }

    /**
     * @summary Creates a guild emoji.
     * @description POSTs image data and roles as JSON; Discord checks permissions, image dimensions, naming and premium-role eligibility.
     * @param options - Name, image data, optional roles and audit reason.
     * @returns Created snapshot, or null on request failure.
     */
    public async create(options: IGuildEmojiCreateOptions): Promise<Emoji | null> {
        if (!options || typeof options !== "object")
            throw new TypeError("Guild emoji creation options must be an object.")
        assertEmojiName(options.name)
        assertEmojiImage(options.image)
        const roles = options.roles === undefined ? [] : options.roles
        assertEmojiRoles(roles)
        const response = await this.client.post<IEmoji>(
            Routes.getGuildEmojis(this.guildId),
            {
                name: options.name,
                image: options.image,
                roles,
            },
            options.reason,
        )
        if (!response.success) return null
        this.client.invalidateCache(Routes.getGuildEmojis(this.guildId))
        return new Emoji(this.client, response.data, this.guildId)
    }

    /**
     * @summary Edits guild emoji metadata.
     * @description Sends only name and roles when provided, preserving explicit null role restrictions.
     * @param emojiOrId - Emoji snapshot or decimal custom identifier.
     * @param options - Optional metadata changes and audit reason.
     * @returns Updated snapshot, or null on request failure.
     */
    public async edit(emojiOrId: Emoji | Snowflake, options: IGuildEmojiEditOptions = {}): Promise<Emoji | null> {
        const id = this.resolveId(emojiOrId)
        if (!options || typeof options !== "object") throw new TypeError("Guild emoji edit options must be an object.")
        const body: Record<string, unknown> = {}
        if (options.name !== undefined) {
            assertEmojiName(options.name)
            body.name = options.name
        }
        if (options.roles !== undefined) {
            if (options.roles !== null) assertEmojiRoles(options.roles)
            body.roles = options.roles
        }
        const response = await this.client.patch<IEmoji>(Routes.getGuildEmoji(this.guildId, id), body, options.reason)
        if (!response.success) return null
        this.client.invalidateCache(Routes.getGuildEmojis(this.guildId))
        return new Emoji(this.client, response.data, this.guildId)
    }

    /**
     * @summary Deletes a custom guild emoji.
     * @description Accepts empty successful responses and invalidates collection and item snapshots.
     * @param emojiOrId - Emoji snapshot or decimal custom identifier.
     * @param reason - Optional audit log explanation.
     * @returns True on success, false on API or transport failure.
     */
    public async delete(emojiOrId: Emoji | Snowflake, reason?: string): Promise<boolean> {
        const id = this.resolveId(emojiOrId)
        const response = await this.client.delete(Routes.getGuildEmoji(this.guildId, id), reason)
        if (!response.success) return false
        this.client.invalidateCache(Routes.getGuildEmojis(this.guildId))
        return true
    }

    /**
     * @summary Resolves a guild mutation target.
     * @description Rejects Unicode, known application ownership and foreign guild snapshots before making a request.
     */
    private resolveId(emojiOrId: Emoji | Snowflake): Snowflake {
        if (emojiOrId instanceof Emoji) {
            if ("applicationId" in emojiOrId || (emojiOrId.guildId !== undefined && emojiOrId.guildId !== this.guildId))
                throw new TypeError("Emoji must belong to this guild.")
        }
        const id = emojiOrId instanceof Emoji ? emojiOrId.id : emojiOrId
        assertEmojiId(id)
        return id
    }
}

export { GuildEmojiManager }
