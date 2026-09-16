/**
 * @summary Utilities for Discord image data URIs.
 * @description Validates Data URI strings Discord accepts for image fields such as webhook avatars. Supports JPG, PNG, and GIF with base64 payloads. Does not encode or decode image bytes.
 * @example
 * ```ts
 * ImageDataManager.isImageData("data:image/png;base64,iVBORw0KGgo=")
 * ```
 */
class ImageDataManager {
    /**
     * @summary Pattern for Discord image data.
     * @description Matches `data:image/jpeg|png|gif;base64,` followed by a base64 payload with optional padding.
     */
    private static readonly IMAGE_DATA_PATTERN: Readonly<RegExp> =
        /^data:image\/(?:jpeg|png|gif);base64,[A-Za-z0-9+/]+={0,2}$/

    /**
     * @summary Private constructor.
     * @description Prevents instantiation and inheritance of the class.
     */
    private constructor() {}

    /**
     * @summary Checks whether a value is Discord image data.
     * @description Confirms the value is a Data URI string with content type `image/jpeg`, `image/png`, or `image/gif` and a base64 payload. This does not verify that the bytes decode to a valid image.
     * @param value - The value to validate.
     * @returns `true` if the value matches Discord's image data format, otherwise `false`.
     */
    public static isImageData(value: unknown): value is string {
        return typeof value === "string" && this.IMAGE_DATA_PATTERN.test(value)
    }
}

export { ImageDataManager }
