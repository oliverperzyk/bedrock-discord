/**
 * @summary Default message notification level.
 * @description Controls which messages members are notified about by default.
 */
enum GuildDefaultMessageNotificationLevel {
    /**
     * @summary All messages.
     * @description Members receive notifications for every message by default.
     */
    ALL_MESSAGES = 0,
    /**
     * @summary Only mentions.
     * @description Members receive notifications only for messages that mention them by default.
     */
    ONLY_MENTIONS = 1,
}

export { GuildDefaultMessageNotificationLevel }
