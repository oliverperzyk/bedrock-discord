import type { Snowflake } from "../../../data/snowflakes/types/Snowflake"

/**
 * @summary A Discord sticker.
 * @description Identifies a sticker; remaining fields come from the sticker resource.
 */
interface ISticker {
    /**
     * @summary Sticker id.
     * @description Snowflake of the sticker.
     */
    readonly id: Snowflake
}

export type { ISticker }
