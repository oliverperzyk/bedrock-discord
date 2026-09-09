/**
 * @summary Guild verification level.
 * @description Restricts who can participate in the guild based on account age, membership duration, or verified contact details.
 */
enum GuildVerificationLevel {
    /**
     * @summary Unrestricted.
     * @description Members are not required to meet additional verification checks.
     */
    NONE = 0,
    /**
     * @summary Low verification.
     * @description Members must have a verified email on their account.
     */
    LOW = 1,
    /**
     * @summary Medium verification.
     * @description Members must be registered on Discord for longer than 5 minutes.
     */
    MEDIUM = 2,
    /**
     * @summary High verification.
     * @description Members must be in the guild for longer than 10 minutes.
     */
    HIGH = 3,
    /**
     * @summary Very high verification.
     * @description Members must have a verified phone number.
     */
    VERY_HIGH = 4,
}

export { GuildVerificationLevel }
