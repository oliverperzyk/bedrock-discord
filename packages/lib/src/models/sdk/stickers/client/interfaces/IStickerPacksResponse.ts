import type { IStickerPack } from "../../base/interfaces/IStickerPack"

/**
 * @summary Sticker pack listing response.
 * @description Discord wraps the available packs in a sticker_packs field.
 */
interface IStickerPacksResponse {
    /**
     * @summary Available packs.
     * @description Full pack resources returned by GET /sticker-packs.
     */
    readonly sticker_packs: readonly IStickerPack[]
}

export type { IStickerPacksResponse }
