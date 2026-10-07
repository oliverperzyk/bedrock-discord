import type { Snowflake } from "../../../data/snowflakes/types/Snowflake"
import type { IEmojiUser } from "./IEmojiUser"

/**
 * @summary Discord emoji wire data.
 * @description Represents Unicode, reaction, guild and application emojis using Discord field names.
 */
interface IEmoji {
    /**
     * @summary Emoji identifier.
     * @description Null for Unicode emoji.
     */
    readonly id: Snowflake | null
    /**
     * @summary Emoji name.
     * @description Unicode text or custom name; null when reaction data is unavailable.
     */
    readonly name: string | null
    /**
     * @summary Allowed roles.
     * @description Guild role identifiers permitted to use this emoji.
     */
    readonly roles?: readonly Snowflake[]
    /**
     * @summary Uploader.
     * @description Included according to endpoint and caller permissions.
     */
    readonly user?: IEmojiUser
    /**
     * @summary Colon requirement.
     * @description Whether the custom name must be wrapped in colons.
     */
    readonly require_colons?: boolean
    /**
     * @summary Managed resource.
     * @description Whether an integration manages this emoji.
     */
    readonly managed?: boolean
    /**
     * @summary Animation flag.
     * @description Whether the emoji image is animated.
     */
    readonly animated?: boolean
    /**
     * @summary Availability.
     * @description May be false after a guild loses boosts.
     */
    readonly available?: boolean
}

export type { IEmoji }
