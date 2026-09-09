import type { Snowflake } from "../../../data/snowflakes/types/Snowflake"
import type { IEmoji } from "../../../emojis/base/interfaces/IEmoji"
import type { IRole } from "../../../roles/base/interfaces/IRole"
import type { ISticker } from "../../../stickers/base/interfaces/ISticker"
import type { IIncidentsData } from "../../incidents/interfaces/IIncidentsData"
import type { GuildDefaultMessageNotificationLevel } from "../enums/GuildDefaultMessageNotificationLevel"
import type { GuildExplicitContentFilterLevel } from "../enums/GuildExplicitContentFilterLevel"
import type { GuildFeature } from "../enums/GuildFeature"
import type { GuildMFALevel } from "../enums/GuildMFALevel"
import type { GuildNSFWLevel } from "../enums/GuildNSFWLevel"
import type { GuildPremiumTier } from "../enums/GuildPremiumTier"
import type { GuildSystemChannelFlags } from "../enums/GuildSystemChannelFlags"
import type { GuildVerificationLevel } from "../enums/GuildVerificationLevel"
import type { IPartialGuild } from "./IPartialGuild"

/**
 * @summary A Discord guild object.
 * @description Full guild resource (a "server") as returned by Get Guild and similar endpoints. Extends {@link IPartialGuild} with owner, channel, role, and settings fields that partial payloads omit.
 */
interface IGuild extends IPartialGuild {
    /**
     * @summary Template icon hash.
     * @description Icon hash returned when the guild is serialized inside a template object.
     */
    readonly iconHash?: string | null
    /**
     * @summary Discovery splash hash.
     * @description CDN hash of the discovery splash; present for guilds with the `DISCOVERABLE` feature.
     */
    readonly discoverySplash: string | null
    /**
     * @summary Whether the current user owns the guild.
     * @description Sent only by Get Current User Guilds, relative to the requested user.
     */
    readonly owner?: boolean
    /**
     * @summary Owner id.
     * @description Snowflake of the user who owns the guild.
     */
    readonly ownerId: Snowflake
    /**
     * @summary Current user permissions.
     * @description Serialized permission bitfield for the requested user, excluding overwrites and implicit permissions. Sent only by Get Current User Guilds.
     */
    readonly permissions?: string
    /**
     * @summary Voice region id.
     * @description Deprecated guild-wide voice region; replaced by `channel.rtc_region`.
     */
    readonly region?: string | null
    /**
     * @summary AFK channel id.
     * @description Voice channel used for AFK members, or `null` when unset.
     */
    readonly afkChannelId: Snowflake | null
    /**
     * @summary AFK timeout.
     * @description Seconds before a member is moved to the AFK channel.
     */
    readonly afkTimeout: number
    /**
     * @summary Widget enabled.
     * @description Whether the server widget is enabled.
     */
    readonly widgetEnabled?: boolean
    /**
     * @summary Widget invite channel.
     * @description Channel the widget invites to, or `null` if the widget does not generate an invite.
     */
    readonly widgetChannelId?: Snowflake | null
    /**
     * @summary Verification level.
     * @description Account checks required before members can participate.
     */
    readonly verificationLevel: GuildVerificationLevel
    /**
     * @summary Default notifications.
     * @description Default message notification level for members.
     */
    readonly defaultMessageNotifications: GuildDefaultMessageNotificationLevel
    /**
     * @summary Explicit content filter.
     * @description Whose media is scanned for explicit content.
     */
    readonly explicitContentFilter: GuildExplicitContentFilterLevel
    /**
     * @summary Roles.
     * @description Roles defined in the guild.
     */
    readonly roles: readonly IRole[]
    /**
     * @summary Emojis.
     * @description Custom emojis uploaded to the guild.
     */
    readonly emojis: readonly IEmoji[]
    /**
     * @summary Features.
     * @description Enabled guild feature flags.
     */
    readonly features: readonly GuildFeature[]
    /**
     * @summary MFA level.
     * @description Whether moderation actions require two-factor authentication.
     */
    readonly mfaLevel: GuildMFALevel
    /**
     * @summary Creating application.
     * @description Application that created the guild when it is bot-created, otherwise `null`.
     */
    readonly applicationId: Snowflake | null
    /**
     * @summary System channel.
     * @description Channel for welcome messages and boost events, or `null` when unset.
     */
    readonly systemChannelId: Snowflake | null
    /**
     * @summary System channel flags.
     * @description Bitfield of suppressed system-channel notifications.
     */
    readonly systemChannelFlags: GuildSystemChannelFlags
    /**
     * @summary Rules channel.
     * @description Channel where Community guilds show rules, or `null` when unset.
     */
    readonly rulesChannelId: Snowflake | null
    /**
     * @summary Max presences.
     * @description Presence cap; Discord always returns `null` except for the largest guilds.
     */
    readonly maxPresences?: number | null
    /**
     * @summary Max members.
     * @description Maximum number of members the guild can have.
     */
    readonly maxMembers?: number
    /**
     * @summary Vanity invite code.
     * @description Custom invite slug, or `null` when the guild has none.
     */
    readonly vanityUrlCode: string | null
    /**
     * @summary Description.
     * @description Public guild description, or `null` when unset.
     */
    readonly description: string | null
    /**
     * @summary Banner hash.
     * @description CDN hash of the guild banner, or `null` when unset.
     */
    readonly banner: string | null
    /**
     * @summary Premium tier.
     * @description Server Boost level.
     */
    readonly premiumTier: GuildPremiumTier
    /**
     * @summary Boost count.
     * @description Number of boosts the guild currently has.
     */
    readonly premiumSubscriptionCount?: number
    /**
     * @summary Preferred locale.
     * @description Locale used for Community guild notices and discovery; defaults to `en-US`.
     */
    readonly preferredLocale: string
    /**
     * @summary Public updates channel.
     * @description Channel where Community admins receive Discord notices, or `null` when unset.
     */
    readonly publicUpdatesChannelId: Snowflake | null
    /**
     * @summary Video channel user cap.
     * @description Maximum users in a video channel.
     */
    readonly maxVideoChannelUsers?: number
    /**
     * @summary Stage video user cap.
     * @description Maximum users in a stage video channel.
     */
    readonly maxStageVideoChannelUsers?: number
    /**
     * @summary Approximate member count.
     * @description Returned by Get Guild and Get Current User Guilds when `with_counts` is `true`.
     */
    readonly approximateMemberCount?: number
    /**
     * @summary Approximate online count.
     * @description Approximate non-offline members, returned when `with_counts` is `true`.
     */
    readonly approximatePresenceCount?: number
    /**
     * @summary Age-restriction level.
     * @description NSFW classification of the guild.
     */
    readonly nsfwLevel: GuildNSFWLevel
    /**
     * @summary Stickers.
     * @description Custom stickers uploaded to the guild.
     */
    readonly stickers?: readonly ISticker[]
    /**
     * @summary Boost progress bar.
     * @description Whether the Server Boost progress bar is enabled.
     */
    readonly premiumProgressBarEnabled: boolean
    /**
     * @summary Safety alerts channel.
     * @description Channel where Community admins receive safety alerts, or `null` when unset.
     */
    readonly safetyAlertsChannelId: Snowflake | null
    /**
     * @summary Incidents data.
     * @description Invite, DM, and raid incident timestamps for the guild, or `null` when none apply.
     */
    readonly incidentsData: IIncidentsData | null
}

export type { IGuild }
