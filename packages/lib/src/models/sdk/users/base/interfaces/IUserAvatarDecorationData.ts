import type { Snowflake } from "../../../data/snowflakes/types/Snowflake"

/**
 * @summary Avatar decoration metadata.
 * @description CDN asset and SKU for the cosmetic overlay applied to a user's avatar.
 */
interface IUserAvatarDecorationData {
    /**
     * @summary Decoration asset hash.
     * @description Hash used to build the avatar decoration CDN URL.
     */
    readonly asset: string
    /**
     * @summary Decoration SKU id.
     * @description Snowflake of the shop SKU this decoration belongs to.
     */
    readonly skuId: Snowflake
}

export type { IUserAvatarDecorationData }
