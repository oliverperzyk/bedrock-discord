import type { IApplicationEmoji } from "../../base/interfaces/IApplicationEmoji"

/**
 * @summary Application emoji listing response.
 * @description The application collection endpoint wraps its resources in an items field.
 */
interface IApplicationEmojisResponse {
    /**
     * @summary Application-owned emojis.
     * @description Full custom emoji resources, including uploader information.
     */
    readonly items: readonly IApplicationEmoji[]
}

export type { IApplicationEmojisResponse }
