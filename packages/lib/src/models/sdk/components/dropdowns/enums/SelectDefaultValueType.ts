/**
 * @summary Type of an auto-populated select default value.
 * @description Discriminator for `default_values` entries: the snowflake is a user, role, or channel.
 */
enum SelectDefaultValueType {
    /**
     * @summary User default.
     * @description The `id` is a user snowflake. Valid on user and mentionable selects.
     */
    USER = "user",
    /**
     * @summary Role default.
     * @description The `id` is a role snowflake. Valid on role and mentionable selects.
     */
    ROLE = "role",
    /**
     * @summary Channel default.
     * @description The `id` is a channel snowflake. Valid on channel selects.
     */
    CHANNEL = "channel",
}

export { SelectDefaultValueType }
