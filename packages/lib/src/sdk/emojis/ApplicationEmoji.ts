import { assertEmojiId, assertEmojiName } from "../../internal/emojis/EmojiValidation"
import type { Snowflake } from "../../models/sdk/data/snowflakes/types/Snowflake"
import type { IApplicationEmoji } from "../../models/sdk/emojis/base/interfaces/IApplicationEmoji"
import type { IApplicationEmojiEditOptions } from "../../models/sdk/emojis/client/interfaces/IApplicationEmojiEditOptions"
import type { IResourceFetchOptions } from "../../models/sdk/client/interfaces/IResourceFetchOptions"
import { DiscordRestClient } from "../client/DiscordRestClient"
import { Routes } from "../globals/Routes"
import { Emoji } from "./Emoji"

/**
 * @summary Represents an application-owned emoji.
 * @description A custom emoji snapshot with direct REST refresh, rename and deletion operations for its owning application.
 * @example
 * ```ts
 * const emoji = new ApplicationEmoji(client, data, applicationId)
 * const renamed = await emoji.edit({ name: "greeting" })
 * await renamed?.delete()
 * ```
 */
class ApplicationEmoji extends Emoji {
    /**
     * @summary Creates an application emoji snapshot.
     * @description Requires decimal owner and emoji IDs plus a nonempty custom name; does not issue a request.
     * @param client - Shared authenticated REST client.
     * @param data - Application emoji wire payload.
     * @param applicationId - Application owning this emoji.
     */
    public constructor(
        client: DiscordRestClient,
        data: IApplicationEmoji,
        public readonly applicationId: Snowflake,
    ) {
        super(client, data)
        assertEmojiId(applicationId)
        assertEmojiId(data.id)
        assertEmojiName(data.name)
    }

    /**
     * @summary Application emoji identifier.
     * @description Guaranteed non-null because application emojis are custom resources.
     */
    public override get id(): Snowflake {
        return this.data.id!
    }

    /**
     * @summary Application emoji name.
     * @description Required on application REST resources, unlike partial reaction payloads.
     */
    public override get name(): string {
        return this.data.name!
    }

    /**
     * @summary Refreshes this application emoji.
     * @description Calls GET /applications/{application.id}/emojis/{emoji.id} using the shared resource cache.
     * @param options - Cache controls.
     * @returns An application emoji snapshot, or null on request failure.
     */
    public fetch(options: IResourceFetchOptions = {}): Promise<ApplicationEmoji | null> {
        const url = Routes.getApplicationEmoji(this.applicationId, this.id)
        return this.client.fetchResource(
            url,
            async () => {
                const response = await this.client.get<IApplicationEmoji>(url)
                return response.success ? new ApplicationEmoji(this.client, response.data, this.applicationId) : null
            },
            options,
        )
    }

    /**
     * @summary Renames this application emoji.
     * @description Sends a JSON PATCH containing name only; invalidates item and listing snapshots on success.
     * @param options - Required new name.
     * @returns Updated snapshot, or null on request failure.
     */
    public async edit(options: IApplicationEmojiEditOptions): Promise<ApplicationEmoji | null> {
        if (!options || typeof options !== "object")
            throw new TypeError("Application emoji edit options must be an object.")
        assertEmojiName(options.name)
        const response = await this.client.patch<IApplicationEmoji>(
            Routes.getApplicationEmoji(this.applicationId, this.id),
            { name: options.name },
        )
        if (!response.success) return null
        this.client.invalidateCache(Routes.getApplicationEmojis(this.applicationId))
        return new ApplicationEmoji(this.client, response.data, this.applicationId)
    }

    /**
     * @summary Deletes this application emoji.
     * @description Calls DELETE on the application item route, accepting an empty successful response.
     * @returns True on success, false on API or transport failure.
     */
    public async delete(): Promise<boolean> {
        const response = await this.client.delete(Routes.getApplicationEmoji(this.applicationId, this.id))
        if (!response.success) return false
        this.client.invalidateCache(Routes.getApplicationEmojis(this.applicationId))
        return true
    }
}

export { ApplicationEmoji }
