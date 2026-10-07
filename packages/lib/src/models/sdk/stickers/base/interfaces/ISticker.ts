import type { Snowflake } from "../../../data/snowflakes/types/Snowflake"
import type { StickerType } from "../enums/StickerType"
import type { StickerFormatType } from "../enums/StickerFormatType"
import type { IStickerUser } from "./IStickerUser"

/**
 * @summary Discord sticker wire data.
 * @description Full sticker resource returned by Discord; optional fields depend on the sticker type and caller permissions.
 */
interface ISticker {
    /**
     * @summary Sticker identifier.
     * @description Snowflake identifying this resource.
     */
    readonly id: Snowflake
    /**
     * @summary Pack identifier.
     * @description Present on standard stickers belonging to a pack.
     */
    readonly pack_id?: Snowflake
    /**
     * @summary Sticker name.
     * @description Display name used in the sticker picker.
     */
    readonly name: string
    /**
     * @summary Sticker description.
     * @description Null when the sticker has no description.
     */
    readonly description: string | null
    /**
     * @summary Suggestion tags.
     * @description Autocomplete text, conventionally comma separated for standard stickers.
     */
    readonly tags: string
    /**
     * @summary Sticker category.
     * @description Distinguishes standard stickers from guild stickers.
     */
    readonly type: StickerType
    /**
     * @summary File format.
     * @description Encoding used to render the sticker.
     */
    readonly format_type: StickerFormatType
    /**
     * @summary Availability.
     * @description May be false when a guild loses required boosts.
     */
    readonly available?: boolean
    /**
     * @summary Owning guild.
     * @description Present for custom guild stickers.
     */
    readonly guild_id?: Snowflake
    /**
     * @summary Uploader.
     * @description Included when the caller has expression permissions.
     */
    readonly user?: IStickerUser
    /**
     * @summary Pack ordering.
     * @description Sort position of a standard sticker within its pack.
     */
    readonly sort_value?: number
}

export type { ISticker }
