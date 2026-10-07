import { assertEmojiId, assertEmojiImage, assertEmojiName } from "../../../internal/emojis/EmojiValidation"
import type { Snowflake } from "../../../models/sdk/data/snowflakes/types/Snowflake"
import type { IApplicationEmoji } from "../../../models/sdk/emojis/base/interfaces/IApplicationEmoji"
import type { IResourceFetchOptions } from "../../../models/sdk/client/interfaces/IResourceFetchOptions"
import type { IApplicationEmojiCreateOptions } from "../../../models/sdk/emojis/client/interfaces/IApplicationEmojiCreateOptions"
import type { IApplicationEmojiEditOptions } from "../../../models/sdk/emojis/client/interfaces/IApplicationEmojiEditOptions"
import type { IApplicationEmojisResponse } from "../../../models/sdk/emojis/client/interfaces/IApplicationEmojisResponse"
import { DiscordRestClient } from "../../client/DiscordRestClient"
import { Routes } from "../../globals/Routes"
import { ApplicationEmoji } from "../ApplicationEmoji"
import { Emoji } from "../Emoji"

/**
 * @summary Manages application-owned emojis.
 * @description Implements all five application emoji routes using the application's bot token and the shared REST resource cache.
 * @example
 * ```ts
 * const emojis = new ApplicationEmojiManager(client, applicationId)
 * const created = await emojis.create({ name: "wave", image: imageData })
 * if (created) await emojis.edit(created, { name: "hello" })
 * const all = await emojis.fetch()
 * ```
 */
class ApplicationEmojiManager {
    /**
     * @summary Creates an application manager.
     * @description Binds route and cache scope to one application; callers must configure that application's bot token.
     * @param client - Shared authenticated REST client.
     * @param applicationId - Owning application snowflake.
     */
    public constructor(
        public readonly client: DiscordRestClient,
        public readonly applicationId: Snowflake,
    ) {
        assertEmojiId(applicationId)
    }

    /**
     * @summary Lists application emojis.
     * @description Calls the application collection route and unwraps items into ApplicationEmoji snapshots.
     * @param id - Omit to list all emojis.
     * @param options - Cache controls.
     * @returns Snapshots, including an empty array, or null on request failure.
     */
    public fetch(id?: undefined, options?: IResourceFetchOptions): Promise<readonly ApplicationEmoji[] | null>
    /**
     * @summary Gets one application emoji.
     * @description Calls the application item route, sharing cached snapshots with instance fetch operations.
     * @param id - Custom emoji snowflake.
     * @param options - Cache controls.
     * @returns Snapshot, or null on request failure.
     */
    public fetch(id: Snowflake, options?: IResourceFetchOptions): Promise<ApplicationEmoji | null>
    public fetch(
        id?: Snowflake,
        options: IResourceFetchOptions = {},
    ): Promise<ApplicationEmoji | readonly ApplicationEmoji[] | null> {
        if (id !== undefined) {
            assertEmojiId(id)
            const url = Routes.getApplicationEmoji(this.applicationId, id)
            return this.client.fetchResource(
                url,
                async () => {
                    const response = await this.client.get<IApplicationEmoji>(url)
                    return response.success
                        ? new ApplicationEmoji(this.client, response.data, this.applicationId)
                        : null
                },
                options,
            )
        }
        const url = Routes.getApplicationEmojis(this.applicationId)
        return this.client.fetchResource(
            url,
            async () => {
                const response = await this.client.get<IApplicationEmojisResponse>(url)
                return response.success
                    ? response.data.items.map((data) => new ApplicationEmoji(this.client, data, this.applicationId))
                    : null
            },
            options,
        )
    }

    /**
     * @summary Creates an application emoji.
     * @description Sends name and image data as JSON; Discord enforces image dimensions, contents, naming and application quotas.
     * @param options - Required name and supported image-data URI.
     * @returns Created snapshot, or null on request failure.
     */
    public async create(options: IApplicationEmojiCreateOptions): Promise<ApplicationEmoji | null> {
        if (!options || typeof options !== "object")
            throw new TypeError("Application emoji creation options must be an object.")
        assertEmojiName(options.name)
        assertEmojiImage(options.image)
        const response = await this.client.post<IApplicationEmoji>(Routes.getApplicationEmojis(this.applicationId), {
            name: options.name,
            image: options.image,
        })
        if (!response.success) return null
        this.client.invalidateCache(Routes.getApplicationEmojis(this.applicationId))
        return new ApplicationEmoji(this.client, response.data, this.applicationId)
    }

    /**
     * @summary Renames an application emoji.
     * @description The application PATCH endpoint accepts name only; guild role restrictions and audit headers are not sent.
     * @param emojiOrId - Emoji snapshot or decimal custom identifier.
     * @param options - Required new name.
     * @returns Updated snapshot, or null on request failure.
     */
    public async edit(
        emojiOrId: Emoji | Snowflake,
        options: IApplicationEmojiEditOptions,
    ): Promise<ApplicationEmoji | null> {
        const id = this.resolveId(emojiOrId)
        if (!options || typeof options !== "object")
            throw new TypeError("Application emoji edit options must be an object.")
        assertEmojiName(options.name)
        const response = await this.client.patch<IApplicationEmoji>(
            Routes.getApplicationEmoji(this.applicationId, id),
            { name: options.name },
        )
        if (!response.success) return null
        this.client.invalidateCache(Routes.getApplicationEmojis(this.applicationId))
        return new ApplicationEmoji(this.client, response.data, this.applicationId)
    }

    /**
     * @summary Deletes an application emoji.
     * @description Accepts successful empty DELETE responses and invalidates this application's item and collection caches.
     * @param emojiOrId - Emoji snapshot or decimal custom identifier.
     * @returns True on success, false on API or transport failure.
     */
    public async delete(emojiOrId: Emoji | Snowflake): Promise<boolean> {
        const id = this.resolveId(emojiOrId)
        const response = await this.client.delete(Routes.getApplicationEmoji(this.applicationId, id))
        if (!response.success) return false
        this.client.invalidateCache(Routes.getApplicationEmojis(this.applicationId))
        return true
    }

    /**
     * @summary Resolves an application mutation target.
     * @description Rejects Unicode emoji, known guild ownership and snapshots belonging to another application.
     */
    private resolveId(emojiOrId: Emoji | Snowflake): Snowflake {
        if (emojiOrId instanceof Emoji) {
            if (
                emojiOrId.guildId !== undefined ||
                (emojiOrId instanceof ApplicationEmoji && emojiOrId.applicationId !== this.applicationId)
            )
                throw new TypeError("Emoji must belong to this application.")
        }
        const id = emojiOrId instanceof Emoji ? emojiOrId.id : emojiOrId
        assertEmojiId(id)
        return id
    }
}

export { ApplicationEmojiManager }
