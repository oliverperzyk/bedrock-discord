import type { IUserNameplate } from "./IUserNameplate"

/**
 * @summary User collectibles.
 * @description Profile cosmetics excluding avatar decorations and profile effects.
 */
interface IUserCollectibles {
    /**
     * @summary Equipped nameplate.
     * @description Nameplate currently shown on the profile, when the user has one equipped.
     */
    readonly nameplate?: IUserNameplate
}

export type { IUserCollectibles }
