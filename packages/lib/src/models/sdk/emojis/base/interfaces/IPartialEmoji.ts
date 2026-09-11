import type { Snowflake } from "../../../data/snowflakes/types/Snowflake"

/**
 * @summary A partial Discord emoji.
 * @description Reduced emoji payload used on components (`name`, `id`, and `animated`).
 */
interface IPartialEmoji {
    /**
     * @summary Emoji id.
     * @description Snowflake of a custom emoji, or `null` for a unicode emoji.
     */
    readonly id: Snowflake | null
    /**
     * @summary Emoji name.
     * @description Unicode character or custom emoji name.
     */
    readonly name?: string | null
    /**
     * @summary Animated emoji.
     * @description Whether this is an animated custom emoji.
     */
    readonly animated?: boolean
}

export type { IPartialEmoji }
