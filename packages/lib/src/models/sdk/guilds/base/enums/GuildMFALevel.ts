/**
 * @summary Guild MFA level.
 * @description Whether moderation actions in the guild require two-factor authentication.
 */
enum GuildMFALevel {
    /**
     * @summary No MFA requirement.
     * @description Moderation actions do not require MFA or 2FA.
     */
    NONE = 0,
    /**
     * @summary Elevated MFA requirement.
     * @description Moderation actions require 2FA.
     */
    ELEVATED = 1,
}

export { GuildMFALevel }
