import type { Snowflake } from "../../../data/snowflakes/types/Snowflake"

/**
 * @summary Guild emoji edit options.
 * @description Only supplied fields are sent; role restrictions may be cleared with null or an empty array.
 */
interface IGuildEmojiEditOptions {
    /**
     * @summary Custom name.
     * @description Optional nonempty replacement name.
     */
    readonly name?: string
    /**
     * @summary Allowed roles.
     * @description Null and empty arrays are preserved in the JSON payload.
     */
    readonly roles?: readonly Snowflake[] | null
    /**
     * @summary Audit reason.
     * @description Optional explanation sent outside the JSON body.
     */
    readonly reason?: string
}

export type { IGuildEmojiEditOptions }
