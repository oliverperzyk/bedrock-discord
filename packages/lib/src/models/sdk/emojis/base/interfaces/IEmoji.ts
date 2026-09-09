import type { Snowflake } from "../../../data/snowflakes/types/Snowflake"

/**
 * @summary A custom guild emoji.
 * @description Identifies an emoji; remaining fields come from the emoji resource.
 */
interface IEmoji {
    /**
     * @summary Emoji id.
     * @description Snowflake of a custom emoji, or `null` for a unicode emoji.
     */
    readonly id: Snowflake | null
}

export type { IEmoji }
