import type { Snowflake } from "../../../data/snowflakes/types/Snowflake"
import type { UserFlags } from "../enums/UserFlags"
import type { IUserAvatarDecorationData } from "./IUserAvatarDecorationData"
import type { IUserCollectibles } from "./IUserCollectibles"
import type { IUserPrimaryGuild } from "./IUserPrimaryGuild"

/**
 * @summary A partial Discord user.
 * @description A reduced user payload used where Discord does not send OAuth-private fields (message authors, mentions, webhook `user`, Get User). Identity and avatar are always present; remaining fields depend on the endpoint.
 */
interface IPartialUser {
    /**
     * @summary User id.
     * @description Snowflake of the user.
     */
    readonly id: Snowflake
    /**
     * @summary Username.
     * @description Unique handle is no longer guaranteed; 2–32 characters, not unique across the platform.
     */
    readonly username: string
    /**
     * @summary Discriminator.
     * @description Legacy four-digit Discord tag, or `"0"` for users migrated to unique usernames.
     */
    readonly discriminator: string
    /**
     * @summary Display name.
     * @description Global display name, or `null` when the user has not set one.
     */
    readonly globalName: string | null
    /**
     * @summary Avatar hash.
     * @description CDN hash of the user's avatar, or `null` when using the default avatar.
     */
    readonly avatar: string | null
    /**
     * @summary Bot account.
     * @description Whether this user belongs to an application.
     */
    readonly bot?: boolean
    /**
     * @summary Official system user.
     * @description Whether this account is part of Discord's urgent message system.
     */
    readonly system?: boolean
    /**
     * @summary Banner hash.
     * @description CDN hash of the profile banner, or `null` when unset.
     */
    readonly banner?: string | null
    /**
     * @summary Banner accent color.
     * @description Integer RGB color used when no banner image is set, or `null` when unset.
     */
    readonly accentColor?: number | null
    /**
     * @summary Public flags.
     * @description Bitfield of badges and capabilities visible without the `email` OAuth scope.
     */
    readonly publicFlags?: UserFlags
    /**
     * @summary Avatar decoration.
     * @description Equipped avatar overlay, or `null` when none is applied.
     */
    readonly avatarDecorationData?: IUserAvatarDecorationData | null
    /**
     * @summary Collectibles.
     * @description Equipped collectibles such as a nameplate, or `null` when none are present.
     */
    readonly collectibles?: IUserCollectibles | null
    /**
     * @summary Primary guild.
     * @description Displayed server tag identity, or `null` when the user has none.
     */
    readonly primaryGuild?: IUserPrimaryGuild | null
}

export type { IPartialUser }
