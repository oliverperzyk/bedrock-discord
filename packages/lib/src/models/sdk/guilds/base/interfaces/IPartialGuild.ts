import type { Snowflake } from "../../../data/snowflakes/types/Snowflake"
import type { IWelcomeScreen } from "../../welcomeScreen/interfaces/IWelcomeScreen"
import type { GuildFeature } from "../enums/GuildFeature"
import type { GuildVerificationLevel } from "../enums/GuildVerificationLevel"

/**
 * @summary A partial Discord guild.
 * @description A reduced guild payload used where Discord does not send the full guild object (invites, some user-guild listings, and similar). Only identity, branding, and a few optional metadata fields are guaranteed.
 */
interface IPartialGuild {
    /**
     * @summary Guild id.
     * @description Snowflake of the guild.
     */
    readonly id: Snowflake
    /**
     * @summary Guild name.
     * @description 2–100 characters, excluding leading and trailing whitespace.
     */
    readonly name: string
    /**
     * @summary Icon hash.
     * @description CDN hash of the guild icon, or `null` when unset.
     */
    readonly icon: string | null
    /**
     * @summary Splash hash.
     * @description CDN hash of the invite splash, or `null` when unset.
     */
    readonly splash: string | null
    /**
     * @summary Banner hash.
     * @description CDN hash of the guild banner, or `null` when unset.
     */
    readonly banner?: string | null
    /**
     * @summary Description.
     * @description Public guild description, or `null` when unset.
     */
    readonly description?: string | null
    /**
     * @summary Features.
     * @description Enabled guild feature flags, when Discord includes them on this payload.
     */
    readonly features?: readonly GuildFeature[]
    /**
     * @summary Verification level.
     * @description Account checks required before members can participate, when included.
     */
    readonly verificationLevel?: GuildVerificationLevel
    /**
     * @summary Vanity invite code.
     * @description Custom invite slug, or `null` when the guild has none.
     */
    readonly vanityUrlCode?: string | null
    /**
     * @summary Welcome screen.
     * @description Community welcome screen; included on some invite guild objects.
     */
    readonly welcomeScreen?: IWelcomeScreen
}

export type { IPartialGuild }
