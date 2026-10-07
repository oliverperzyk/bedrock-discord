import type { Snowflake } from "../../models/sdk/data/snowflakes/types/Snowflake"
import type { ISticker } from "../../models/sdk/stickers/base/interfaces/ISticker"
import type { IStickerUser } from "../../models/sdk/stickers/base/interfaces/IStickerUser"
import type { StickerType } from "../../models/sdk/stickers/base/enums/StickerType"
import type { StickerFormatType } from "../../models/sdk/stickers/base/enums/StickerFormatType"
import type { IStickerFetchOptions } from "../../models/sdk/stickers/client/interfaces/IStickerFetchOptions"
import { DiscordRestClient } from "../client/DiscordRestClient"
import { Routes } from "../globals/Routes"

/**
 * @summary Represents a Discord sticker.
 * @description A readonly resource snapshot with camelCase sticker properties and a REST refresh operation.
 * @example
 * ```ts
 * const client = new DiscordRestClient().setToken("bot-token")
 * const sticker = await Sticker.fetch(client, stickerId)
 * console.warn(sticker?.name)
 * ```
 */
class Sticker {
    /**
     * @summary Creates a sticker snapshot.
     * @description Hydrates API data without making a request; fetch returns a new snapshot.
     * @param client - Shared authenticated REST client.
     * @param data - Full Discord sticker wire data.
     */
    public constructor(
        public readonly client: DiscordRestClient,
        private readonly data: ISticker,
    ) {}

    /**
     * @summary Sticker identifier.
     * @description Snowflake of this resource.
     */
    public get id(): Snowflake {
        return this.data.id
    }

    /**
     * @summary Pack identifier.
     * @description Present on standard stickers.
     */
    public get packId(): Snowflake | undefined {
        return this.data.pack_id
    }

    /**
     * @summary Display name.
     * @description Name shown in the sticker picker.
     */
    public get name(): string {
        return this.data.name
    }

    /**
     * @summary Description.
     * @description Null when no description is set.
     */
    public get description(): string | null {
        return this.data.description
    }

    /**
     * @summary Suggestion tags.
     * @description Autocomplete text supplied by Discord.
     */
    public get tags(): string {
        return this.data.tags
    }

    /**
     * @summary Category.
     * @description Standard pack sticker or custom guild sticker.
     */
    public get type(): StickerType {
        return this.data.type
    }

    /**
     * @summary File format.
     * @description Encoding used by the sticker asset.
     */
    public get formatType(): StickerFormatType {
        return this.data.format_type
    }

    /**
     * @summary Availability.
     * @description May be false after loss of guild boosts.
     */
    public get available(): boolean | undefined {
        return this.data.available
    }

    /**
     * @summary Owning guild.
     * @description Absent for standard stickers.
     */
    public get guildId(): Snowflake | undefined {
        return this.data.guild_id
    }

    /**
     * @summary Uploader.
     * @description Public user wire data when caller permissions allow it.
     */
    public get user(): IStickerUser | undefined {
        return this.data.user
    }

    /**
     * @summary Pack ordering.
     * @description Position within a standard sticker pack.
     */
    public get sortValue(): number | undefined {
        return this.data.sort_value
    }

    /**
     * @summary Gets a sticker by ID.
     * @description Calls GET /stickers/{id}, using only this client's resource cache.
     * @param client - Shared authenticated REST client.
     * @param id - Sticker snowflake.
     * @param options - Cache controls.
     * @returns A hydrated sticker, or null on request failure.
     */
    public static fetch(
        client: DiscordRestClient,
        id: Snowflake,
        options: IStickerFetchOptions = {},
    ): Promise<Sticker | null> {
        const url = Routes.getSticker(id)
        return client.fetchResource(
            url,
            async () => {
                const response = await client.get<ISticker>(url)
                return response.success ? new Sticker(client, response.data) : null
            },
            options,
        )
    }

    /**
     * @summary Refreshes this sticker.
     * @description Returns a snapshot from the global sticker endpoint, respecting the supplied cache controls.
     * @param options - Cache controls.
     * @returns A sticker snapshot, or null on request failure.
     */
    public fetch(options: IStickerFetchOptions = {}): Promise<Sticker | null> {
        return Sticker.fetch(this.client, this.id, options)
    }
}

export { Sticker }
