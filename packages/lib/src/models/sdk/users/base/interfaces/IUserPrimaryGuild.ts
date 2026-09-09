import type { Snowflake } from "../../../data/snowflakes/types/Snowflake"

/**
 * @summary User primary guild (server tag).
 * @description Guild identity a user can display as a four-character tag next to their name.
 */
interface IUserPrimaryGuild {
    /**
     * @summary Identity guild id.
     * @description Snowflake of the guild whose tag is shown, or `null` when none is set.
     */
    readonly identityGuildId: Snowflake | null
    /**
     * @summary Whether the tag is displayed.
     * @description `true` when the tag is shown, `false` when the user hid it, or `null` when Discord cleared the identity (for example the guild no longer supports tags).
     */
    readonly identityEnabled: boolean | null
    /**
     * @summary Tag text.
     * @description Up to four characters shown as the server tag, or `null` when unset.
     */
    readonly tag: string | null
    /**
     * @summary Tag badge hash.
     * @description CDN hash of the guild tag badge, or `null` when unset.
     */
    readonly badge: string | null
}

export type { IUserPrimaryGuild }
