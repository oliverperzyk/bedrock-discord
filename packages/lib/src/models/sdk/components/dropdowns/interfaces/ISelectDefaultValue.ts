import type { Snowflake } from "../../../../data/snowflakes/types/Snowflake"
import type { SelectDefaultValueType } from "../enums/SelectDefaultValueType"

/**
 * @summary Default value for an auto-populated select menu.
 * @description Pre-selected user, role, or channel shown when the menu opens. Count must fall within `min_values` and `max_values`.
 */
interface ISelectDefaultValue {
    /**
     * @summary Entity snowflake.
     * @description ID of the user, role, or channel to show as selected by default.
     */
    readonly id: Snowflake
    /**
     * @summary Entity kind.
     * @description Whether `id` refers to a user, role, or channel.
     */
    readonly type: SelectDefaultValueType
}

export type { ISelectDefaultValue }
