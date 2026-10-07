import type { IStickerFile } from "./IStickerFile"

/**
 * @summary Guild sticker creation options.
 * @description Metadata becomes individual multipart form fields, alongside a file part named file.
 */
interface IGuildStickerCreateOptions {
    /**
     * @summary Sticker name.
     * @description Must contain 2 to 30 characters.
     */
    readonly name: string
    /**
     * @summary Description.
     * @description Defaults to empty; otherwise must contain 2 to 100 characters.
     */
    readonly description?: string
    /**
     * @summary Suggestion tags.
     * @description Autocomplete text of at most 200 characters.
     */
    readonly tags: string
    /**
     * @summary Sticker asset.
     * @description PNG, APNG, GIF or Lottie JSON upload.
     */
    readonly file: IStickerFile
    /**
     * @summary Audit reason.
     * @description Optional explanation encoded into X-Audit-Log-Reason.
     */
    readonly reason?: string
}

export type { IGuildStickerCreateOptions }
