/**
 * @summary Guild age-restriction level.
 * @description Classifies how age-restricted the guild is for discovery and client presentation.
 */
enum GuildNSFWLevel {
    /**
     * @summary Default.
     * @description The guild has no special age-restriction classification.
     */
    DEFAULT = 0,
    /**
     * @summary Explicit.
     * @description The guild is marked as explicit.
     */
    EXPLICIT = 1,
    /**
     * @summary Safe.
     * @description The guild is marked as safe.
     */
    SAFE = 2,
    /**
     * @summary Age restricted.
     * @description The guild is age-restricted.
     */
    AGE_RESTRICTED = 3,
}

export { GuildNSFWLevel }
