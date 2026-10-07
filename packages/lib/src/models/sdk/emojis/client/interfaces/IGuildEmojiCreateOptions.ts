import type { Snowflake } from "../../../data/snowflakes/types/Snowflake"

/**
 * @summary Guild emoji creation options.
 * @description Uploads image data and optional role restrictions through a JSON request.
 */
interface IGuildEmojiCreateOptions {
    /**
     * @summary Custom name.
     * @description Nonempty name; Discord enforces detailed restrictions.
     */
    readonly name: string
    /**
     * @summary Image data.
     * @description Base64 JPEG, PNG, GIF, WebP or AVIF URI containing at most 256 KiB.
     */
    readonly image: string
    /**
     * @summary Allowed roles.
     * @description Defaults to an empty list for unrestricted use.
     */
    readonly roles?: readonly Snowflake[]
    /**
     * @summary Audit reason.
     * @description Optional explanation sent in an encoded header.
     */
    readonly reason?: string
}

export type { IGuildEmojiCreateOptions }
