/**
 * @summary Enabled guild feature.
 * @description String flags Discord returns for capabilities and settings unlocked on a guild.
 */
enum GuildFeature {
    /**
     * @summary Animated banner.
     * @description The guild can set an animated banner image.
     */
    ANIMATED_BANNER = "ANIMATED_BANNER",
    /**
     * @summary Animated icon.
     * @description The guild can set an animated icon.
     */
    ANIMATED_ICON = "ANIMATED_ICON",
    /**
     * @summary Application command permissions v2.
     * @description The guild uses the old application command permissions configuration.
     */
    APPLICATION_COMMAND_PERMISSIONS_V2 = "APPLICATION_COMMAND_PERMISSIONS_V2",
    /**
     * @summary Auto moderation.
     * @description The guild has auto moderation rules configured.
     */
    AUTO_MODERATION = "AUTO_MODERATION",
    /**
     * @summary Banner.
     * @description The guild can set a banner image.
     */
    BANNER = "BANNER",
    /**
     * @summary Community.
     * @description The guild can use Community features such as welcome screen, Membership Screening, and discovery.
     */
    COMMUNITY = "COMMUNITY",
    /**
     * @summary Creator monetization.
     * @description The guild has monetization enabled.
     */
    CREATOR_MONETIZABLE_PROVISIONAL = "CREATOR_MONETIZABLE_PROVISIONAL",
    /**
     * @summary Creator store page.
     * @description The guild has the role subscription promo page enabled.
     */
    CREATOR_STORE_PAGE = "CREATOR_STORE_PAGE",
    /**
     * @summary Developer support server.
     * @description The guild is set as a support server in the App Directory.
     */
    DEVELOPER_SUPPORT_SERVER = "DEVELOPER_SUPPORT_SERVER",
    /**
     * @summary Discoverable.
     * @description The guild can appear in Server Discovery.
     */
    DISCOVERABLE = "DISCOVERABLE",
    /**
     * @summary Enhanced role colors.
     * @description The guild can set gradient colors on roles.
     */
    ENHANCED_ROLE_COLORS = "ENHANCED_ROLE_COLORS",
    /**
     * @summary Featurable.
     * @description The guild can be featured in the directory.
     */
    FEATURABLE = "FEATURABLE",
    /**
     * @summary Guild tags.
     * @description The guild can set guild tags.
     */
    GUILD_TAGS = "GUILD_TAGS",
    /**
     * @summary Guests enabled.
     * @description The guild can use guest invites.
     */
    GUESTS_ENABLED = "GUESTS_ENABLED",
    /**
     * @summary Invites disabled.
     * @description Invites are paused so new users cannot join.
     */
    INVITES_DISABLED = "INVITES_DISABLED",
    /**
     * @summary Invite splash.
     * @description The guild can set an invite splash background.
     */
    INVITE_SPLASH = "INVITE_SPLASH",
    /**
     * @summary Membership screening.
     * @description Membership Screening is enabled.
     */
    MEMBER_VERIFICATION_GATE_ENABLED = "MEMBER_VERIFICATION_GATE_ENABLED",
    /**
     * @summary More soundboard slots.
     * @description The guild has extra custom soundboard slots.
     */
    MORE_SOUNDBOARD = "MORE_SOUNDBOARD",
    /**
     * @summary More sticker slots.
     * @description The guild has extra custom sticker slots.
     */
    MORE_STICKERS = "MORE_STICKERS",
    /**
     * @summary Announcement channels.
     * @description The guild can create announcement channels.
     */
    NEWS = "NEWS",
    /**
     * @summary Partnered.
     * @description The guild is a Discord Partner.
     */
    PARTNERED = "PARTNERED",
    /**
     * @summary Preview enabled.
     * @description The guild can be previewed before joining.
     */
    PREVIEW_ENABLED = "PREVIEW_ENABLED",
    /**
     * @summary Prune requires admin.
     * @description Pruning members requires an administrator.
     */
    PRUNE_REQUIRES_ADMIN = "PRUNE_REQUIRES_ADMIN",
    /**
     * @summary Raid alerts disabled.
     * @description Join-raid alerts are disabled in the safety alerts channel.
     */
    RAID_ALERTS_DISABLED = "RAID_ALERTS_DISABLED",
    /**
     * @summary Role icons.
     * @description The guild can set role icons.
     */
    ROLE_ICONS = "ROLE_ICONS",
    /**
     * @summary Role subscriptions for purchase.
     * @description Role subscriptions can be purchased in the guild.
     */
    ROLE_SUBSCRIPTIONS_AVAILABLE_FOR_PURCHASE = "ROLE_SUBSCRIPTIONS_AVAILABLE_FOR_PURCHASE",
    /**
     * @summary Role subscriptions enabled.
     * @description Role subscriptions are enabled.
     */
    ROLE_SUBSCRIPTIONS_ENABLED = "ROLE_SUBSCRIPTIONS_ENABLED",
    /**
     * @summary Soundboard.
     * @description The guild has created soundboard sounds.
     */
    SOUNDBOARD = "SOUNDBOARD",
    /**
     * @summary Ticketed events.
     * @description Ticketed events are enabled.
     */
    TICKETED_EVENTS_ENABLED = "TICKETED_EVENTS_ENABLED",
    /**
     * @summary Vanity URL.
     * @description The guild can set a vanity invite URL.
     */
    VANITY_URL = "VANITY_URL",
    /**
     * @summary Verified.
     * @description The guild is verified.
     */
    VERIFIED = "VERIFIED",
    /**
     * @summary VIP regions.
     * @description The guild can use 384kbps bitrate in voice channels.
     */
    VIP_REGIONS = "VIP_REGIONS",
    /**
     * @summary Welcome screen.
     * @description The welcome screen is enabled.
     */
    WELCOME_SCREEN_ENABLED = "WELCOME_SCREEN_ENABLED",
}

export { GuildFeature }
