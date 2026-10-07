import type { Snowflake } from "../../../data/snowflakes/types/Snowflake"

/**
 * @summary Emoji uploader wire data.
 * @description Public account identity provided on emoji routes when permissions allow it.
 */
interface IEmojiUser {
    /**
     * @summary User identifier.
     * @description Snowflake of the uploader.
     */
    readonly id: Snowflake
    /**
     * @summary Username.
     * @description Public handle of the account.
     */
    readonly username: string
    /**
     * @summary Legacy tag.
     * @description Zero for accounts migrated to unique usernames.
     */
    readonly discriminator: string
    /**
     * @summary Avatar hash.
     * @description Null when the account uses a default avatar.
     */
    readonly avatar: string | null
    /**
     * @summary Global display name.
     * @description May be omitted in reduced user payloads.
     */
    readonly global_name?: string | null
    /**
     * @summary Bot account.
     * @description Whether this user belongs to an application.
     */
    readonly bot?: boolean
    /**
     * @summary System account.
     * @description Whether Discord operates this account.
     */
    readonly system?: boolean
    /**
     * @summary Public flags.
     * @description Bitfield of publicly visible account badges.
     */
    readonly public_flags?: number
    /**
     * @summary Banner hash.
     * @description Public profile artwork when present.
     */
    readonly banner?: string | null
    /**
     * @summary Accent color.
     * @description Optional RGB profile color.
     */
    readonly accent_color?: number | null
}

export type { IEmojiUser }
