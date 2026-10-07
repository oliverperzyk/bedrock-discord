import type { Snowflake } from "../../../data/snowflakes/types/Snowflake"

/**
 * @summary Sticker uploader wire data.
 * @description A public Discord user payload using API field names.
 */
interface IStickerUser {
    /**
     * @summary User identifier.
     * @description Snowflake of the uploader.
     */
    readonly id: Snowflake
    /**
     * @summary Username.
     * @description Public account handle.
     */
    readonly username: string
    /**
     * @summary Discriminator.
     * @description Legacy tag or zero for migrated accounts.
     */
    readonly discriminator: string
    /**
     * @summary Display name.
     * @description Null when no global display name is configured.
     */
    readonly global_name: string | null
    /**
     * @summary Avatar hash.
     * @description Null for a default avatar.
     */
    readonly avatar: string | null
    /**
     * @summary Bot flag.
     * @description Whether the uploader is an application account.
     */
    readonly bot?: boolean
    /**
     * @summary System flag.
     * @description Whether this is an official Discord system account.
     */
    readonly system?: boolean
}

export type { IStickerUser }
