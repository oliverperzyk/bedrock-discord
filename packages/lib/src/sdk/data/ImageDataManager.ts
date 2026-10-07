/**
 * @summary Utilities for Discord image data URIs.
 * @description Validates avatar and emoji data URIs with separate supported formats; measures emoji bytes without decoding images.
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
    /**
     * @summary Checks emoji image data.
     * @description Accepts canonical base64 JPEG, PNG, GIF, WebP and AVIF URIs without changing avatar validation.
     * @param value - Candidate image-data URI.
     * @returns True when the URI contains valid nonempty encoded bytes.
     */
    public static isEmojiImageData(value: unknown): value is string {
        return this.getEmojiImageDataSize(value) !== null
    }

    /**
     * @summary Measures encoded emoji image data.
     * @description Validates MIME type, base64 padding and unused trailing bits; calculates byte size without decoding or using Node APIs.
     * @param value - Candidate image-data URI.
     * @returns Decoded byte count, or null for malformed or unsupported data.
     */
    public static getEmojiImageDataSize(value: unknown): number | null {
        if (typeof value !== "string") return null
        const match = /^data:image\/(?:jpeg|png|gif|webp|avif);base64,([A-Za-z0-9+/]+={0,2})$/.exec(value)
        const payload = match?.[1]
        if (!payload || payload.length % 4 !== 0) return null
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
        const padding = payload.endsWith("==") ? 2 : payload.endsWith("=") ? 1 : 0
        if (padding !== 0) {
            const last = alphabet.indexOf(payload[payload.length - padding - 1]!)
            if ((last & (padding === 2 ? 15 : 3)) !== 0) return null
        }
        return (payload.length / 4) * 3 - padding
    }
}

export { ImageDataManager }
