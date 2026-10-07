import type { HttpHeader } from "@minecraft/server-net"
import type { IStickerFile } from "./IStickerFile"

/**
 * @summary Sticker upload adapter request.
 * @description The adapter constructs multipart/form-data with individual fields and a file part named file, then executes the request.
 */
interface IStickerMultipartRequest {
    /**
     * @summary Destination.
     * @description Absolute Discord guild sticker creation URL.
     */
    readonly url: string
    /**
     * @summary HTTP verb.
     * @description Creation always uses POST.
     */
    readonly method: "POST"
    /**
     * @summary Request headers.
     * @description Authentication and optional encoded audit reason; adapter adds the multipart boundary content type.
     */
    readonly headers: readonly HttpHeader[]
    /**
     * @summary Form fields.
     * @description Separate name, description and tags parts; do not wrap these in payload_json.
     */
    readonly fields: Readonly<Record<string, string>>
    /**
     * @summary File part.
     * @description Unmodified bytes and metadata attached using the form key file.
     */
    readonly file: IStickerFile
}

export type { IStickerMultipartRequest }
