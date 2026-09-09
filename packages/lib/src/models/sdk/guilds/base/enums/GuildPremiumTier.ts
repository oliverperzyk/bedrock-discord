/**
 * @summary Guild premium tier.
 * @description Server Boost level unlocked by the guild.
 */
enum GuildPremiumTier {
    /**
     * @summary No boost perks.
     * @description The guild has not unlocked any Server Boost perks.
     */
    NONE = 0,
    /**
     * @summary Boost level 1.
     * @description The guild has unlocked Server Boost level 1 perks.
     */
    TIER_1 = 1,
    /**
     * @summary Boost level 2.
     * @description The guild has unlocked Server Boost level 2 perks.
     */
    TIER_2 = 2,
    /**
     * @summary Boost level 3.
     * @description The guild has unlocked Server Boost level 3 perks.
     */
    TIER_3 = 3,
}

export { GuildPremiumTier }
