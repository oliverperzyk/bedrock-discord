/**
 * @summary Public account badges and capability bits.
 * @description Bitfield values Discord attaches to a user. Combine members with bitwise OR; test with AND.
 */
enum UserFlags {
    /**
     * @summary Discord Employee.
     * @description User is a Discord staff member.
     */
    STAFF = 1 << 0,
    /**
     * @summary Partnered Server Owner.
     * @description User owns a Partnered guild.
     */
    PARTNER = 1 << 1,
    /**
     * @summary HypeSquad Events.
     * @description User is a HypeSquad Events member.
     */
    HYPESQUAD = 1 << 2,
    /**
     * @summary Bug Hunter Level 1.
     * @description User has the first Bug Hunter badge.
     */
    BUG_HUNTER_LEVEL_1 = 1 << 3,
    /**
     * @summary House Bravery.
     * @description User is in HypeSquad House Bravery.
     */
    HYPESQUAD_ONLINE_HOUSE_1 = 1 << 6,
    /**
     * @summary House Brilliance.
     * @description User is in HypeSquad House Brilliance.
     */
    HYPESQUAD_ONLINE_HOUSE_2 = 1 << 7,
    /**
     * @summary House Balance.
     * @description User is in HypeSquad House Balance.
     */
    HYPESQUAD_ONLINE_HOUSE_3 = 1 << 8,
    /**
     * @summary Early Nitro Supporter.
     * @description User subscribed to Nitro before the discriminator change.
     */
    PREMIUM_EARLY_SUPPORTER = 1 << 9,
    /**
     * @summary Team user.
     * @description This user object represents a developer team, not a person.
     */
    TEAM_PSEUDO_USER = 1 << 10,
    /**
     * @summary Bug Hunter Level 2.
     * @description User has the gold Bug Hunter badge.
     */
    BUG_HUNTER_LEVEL_2 = 1 << 14,
    /**
     * @summary Verified Bot.
     * @description Bot has passed Discord verification.
     */
    VERIFIED_BOT = 1 << 16,
    /**
     * @summary Early Verified Bot Developer.
     * @description User verified a bot before the current verification program.
     */
    VERIFIED_DEVELOPER = 1 << 17,
    /**
     * @summary Moderator Programs Alumni.
     * @description User completed Discord's moderator certification program.
     */
    CERTIFIED_MODERATOR = 1 << 18,
    /**
     * @summary HTTP interactions only.
     * @description Bot receives interactions over HTTP and appears in the online member list.
     */
    BOT_HTTP_INTERACTIONS = 1 << 19,
}

export { UserFlags }
