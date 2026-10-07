import type { Snowflake } from "../../../data/snowflakes/types/Snowflake"
import type { ISticker } from "./ISticker"

/**
 * @summary Discord sticker pack wire data.
 * @description A collection of standard stickers with store and artwork metadata.
 */
interface IStickerPack {
    /**
     * @summary Pack identifier.
     * @description Snowflake of this resource.
     */
    readonly id: Snowflake
    /**
     * @summary Pack contents.
     * @description Full standard sticker resources belonging to this pack.
     */
    readonly stickers: readonly ISticker[]
    /**
     * @summary Pack name.
     * @description Title shown in the sticker store.
     */
    readonly name: string
    /**
     * @summary Store SKU.
     * @description Identifier of the associated purchasable product.
     */
    readonly sku_id: Snowflake
    /**
     * @summary Cover sticker.
     * @description Sticker displayed as the pack icon when present.
     */
    readonly cover_sticker_id?: Snowflake
    /**
     * @summary Pack description.
     * @description Text describing the collection.
     */
    readonly description: string
    /**
     * @summary Banner asset.
     * @description Optional identifier of the pack banner artwork.
     */
    readonly banner_asset_id?: Snowflake
}

export type { IStickerPack }
