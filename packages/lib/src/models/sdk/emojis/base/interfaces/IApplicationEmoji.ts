import type { Snowflake } from "../../../data/snowflakes/types/Snowflake"
import type { IEmoji } from "./IEmoji"

/**
 * @summary Application emoji wire data.
 * @description Application REST resources always have a custom emoji identifier and name.
 */
interface IApplicationEmoji extends IEmoji {
    /**
     * @summary Custom identifier.
     * @description Application emojis cannot represent Unicode emoji.
     */
    readonly id: Snowflake
    /**
     * @summary Custom name.
     * @description Required for application-owned resources, unlike deleted reaction data.
     */
    readonly name: string
}

export type { IApplicationEmoji }
