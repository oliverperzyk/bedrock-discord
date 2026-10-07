import type { Snowflake } from "../../models/sdk/data/snowflakes/types/Snowflake"
import { ImageDataManager } from "../../sdk/data/ImageDataManager"

/**
 * @summary Validates emoji route identifiers.
 * @description Rejects Unicode emoji and path fragments before constructing resource URLs.
 */
function assertEmojiId(value: unknown): asserts value is Snowflake {
    if (typeof value !== "string" || !/^\d+$/.test(value))
        throw new TypeError("Emoji and owner IDs must be decimal snowflakes.")
}

/**
 * @summary Validates an emoji name.
 * @description Discord remains responsible for detailed naming restrictions.
 */
function assertEmojiName(value: unknown): asserts value is string {
    if (typeof value !== "string" || !value.trim()) throw new TypeError("Emoji name must be a nonempty string.")
}

/**
 * @summary Validates role restrictions.
 * @description Requires an array of decimal snowflakes; callers handle optional or nullable role lists separately.
 */
function assertEmojiRoles(value: unknown): asserts value is readonly Snowflake[] {
    if (!Array.isArray(value)) throw new TypeError("Emoji roles must be an array of snowflakes.")
    for (const id of value) assertEmojiId(id)
}

/**
 * @summary Validates an emoji upload.
 * @description Requires supported canonical image data containing 1 to 262144 decoded bytes; Discord checks image dimensions and contents.
 */
function assertEmojiImage(value: unknown): asserts value is string {
    const size = ImageDataManager.getEmojiImageDataSize(value)
    if (size === null) throw new TypeError("Emoji image must be a valid base64 JPEG, PNG, GIF, WebP or AVIF data URI.")
    if (size < 1 || size > 256 * 1024) throw new RangeError("Emoji image must contain 1 to 262144 bytes (256 KiB).")
}

export { assertEmojiId, assertEmojiName, assertEmojiRoles, assertEmojiImage }
