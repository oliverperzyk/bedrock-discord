/**
 * @summary Explicit content filter level.
 * @description Controls whose media is scanned for explicit content in the guild.
 */
enum GuildExplicitContentFilterLevel {
    /**
     * @summary Filter disabled.
     * @description Media content will not be scanned.
     */
    DISABLED = 0,
    /**
     * @summary Members without roles.
     * @description Media sent by members without roles will be scanned.
     */
    MEMBERS_WITHOUT_ROLES = 1,
    /**
     * @summary All members.
     * @description Media sent by all members will be scanned.
     */
    ALL_MEMBERS = 2,
}

export { GuildExplicitContentFilterLevel }
