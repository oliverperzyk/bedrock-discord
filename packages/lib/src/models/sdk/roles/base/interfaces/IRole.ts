import type { Snowflake } from "../../../data/snowflakes/types/Snowflake"

/**
 * @summary A Discord role.
 * @description Identifies a role in a guild; remaining fields come from the permissions role object.
 */
interface IRole {
    /**
     * @summary Role id.
     * @description Snowflake of the role.
     */
    readonly id: Snowflake
}

export type { IRole }
