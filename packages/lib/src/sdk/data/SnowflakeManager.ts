import type { Snowflake } from "../../models/sdk/data/snowflakes/types/Snowflake"

/**
 * @summary Utilities for Discord snowflake IDs.
 * @description Validates Discord snowflakes from their documented 64-bit layout, without calling the API to check whether an ID exists.
 * @example
 * ```ts
 * SnowflakeManager.isSnowflake("175928847299117063")
 * ```
 */
class SnowflakeManager {
    /**
     * @summary Discord epoch in milliseconds.
     * @description Unix timestamp for the first second of 2015 (`1420070400000`), which snowflake timestamps are offset from.
     */
    private static readonly DISCORD_EPOCH: number = 1_420_070_400_000

    /**
     * @summary Maximum snowflake value.
     * @description Discord snowflakes are unsigned 64-bit integers, so they cannot exceed `2^64 - 1`.
     */
    private static readonly MAX_SNOWFLAKE: bigint = 18_446_744_073_709_551_615n

    /**
     * @summary Pattern for a decimal snowflake string.
     * @description Discord returns IDs as strings of 17 to 20 digits so they are not truncated as JSON numbers.
     */
    private static readonly SNOWFLAKE_PATTERN: Readonly<RegExp> = /^[1-9]\d{16,19}$/

    /**
     * @summary Private constructor.
     * @description Prevents instantiation and inheritance of the class.
     */
    private constructor() {}

    /**
     * @summary Checks whether a value is a well-formed Discord snowflake.
     * @description Confirms the value is a decimal uint64 string and that `(id >> 22) + 1420070400000` decodes to a timestamp at or after the Discord epoch. This does not verify that the ID exists on Discord.
     * @param snowflake - The value to validate.
     * @returns `true` if the value is a structurally valid snowflake, otherwise `false`.
     */
    public static isSnowflake(snowflake: unknown): snowflake is Snowflake {
        if (typeof snowflake !== "string" || !this.SNOWFLAKE_PATTERN.test(snowflake)) {
            return false
        }

        const id: bigint = BigInt(snowflake)
        if (id > this.MAX_SNOWFLAKE) {
            return false
        }

        const timestamp: number = Number(id >> 22n) + this.DISCORD_EPOCH
        return Number.isFinite(timestamp) && timestamp >= this.DISCORD_EPOCH
    }
}

export { SnowflakeManager }
