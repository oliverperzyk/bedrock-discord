/**
 * @summary System channel flags.
 * @description Bitfield of suppressed system-channel notifications and related UI.
 */
enum GuildSystemChannelFlags {
    /**
     * @summary Suppress join notifications.
     * @description Hides member join messages in the system channel.
     */
    SUPPRESS_JOIN_NOTIFICATIONS = 1 << 0,
    /**
     * @summary Suppress boost notifications.
     * @description Hides Server Boost messages in the system channel.
     */
    SUPPRESS_PREMIUM_SUBSCRIPTIONS = 1 << 1,
    /**
     * @summary Suppress setup tips.
     * @description Hides server setup reminder notifications.
     */
    SUPPRESS_GUILD_REMINDER_NOTIFICATIONS = 1 << 2,
    /**
     * @summary Hide join sticker replies.
     * @description Hides member join sticker reply buttons.
     */
    SUPPRESS_JOIN_NOTIFICATION_REPLIES = 1 << 3,
    /**
     * @summary Suppress role subscription notifications.
     * @description Hides role subscription purchase and renewal notifications.
     */
    SUPPRESS_ROLE_SUBSCRIPTION_PURCHASE_NOTIFICATIONS = 1 << 4,
    /**
     * @summary Hide role subscription sticker replies.
     * @description Hides role subscription sticker reply buttons.
     */
    SUPPRESS_ROLE_SUBSCRIPTION_PURCHASE_NOTIFICATION_REPLIES = 1 << 5,
}

export { GuildSystemChannelFlags }
