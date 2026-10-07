import type { StickerContentType } from "../types/StickerContentType"

/**
 * @summary Sticker upload file.
 * @description Explicit file metadata and bytes suitable for transports outside the Bedrock string-body API.
 */
interface IStickerFile {
    /**
     * @summary File bytes.
     * @description Original binary contents, at most 512 KiB.
     */
    readonly data: Uint8Array
    /**
     * @summary File name.
     * @description Multipart filename, for example wave.png or animation.json.
     */
    readonly filename: string
    /**
     * @summary Media type.
     * @description Explicit encoding; dimensions, duration and actual file validity are checked by Discord.
     */
    readonly contentType: StickerContentType
}

export type { IStickerFile }
