import type { Snowflake } from "../../../data/snowflakes/types/Snowflake"
import type { UserNameplatePalette } from "../enums/UserNameplatePalette"

/**
 * @summary Profile nameplate.
 * @description Collectible banner shown behind a user's name in the member list and profile.
 */
interface IUserNameplate {
    /**
     * @summary Nameplate SKU id.
     * @description Snowflake of the shop SKU this nameplate belongs to.
     */
    readonly skuId: Snowflake
    /**
     * @summary Asset path.
     * @description Path fragment used to build the nameplate CDN URL.
     */
    readonly asset: string
    /**
     * @summary Accessibility label.
     * @description Human-readable label; currently unused by Discord.
     */
    readonly label: string
    /**
     * @summary Background palette.
     * @description Named color applied behind the nameplate artwork.
     */
    readonly palette: UserNameplatePalette
}

export type { IUserNameplate }
