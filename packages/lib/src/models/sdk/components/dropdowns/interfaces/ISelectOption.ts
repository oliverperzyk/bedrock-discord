import type { IPartialEmoji } from "../../../../emojis/base/interfaces/IPartialEmoji"

/**
 * @summary Choice in a string select menu.
 * @description User-facing option with a developer-defined `value`. At most 25 options per string select.
 */
interface ISelectOption {
    /**
     * @summary Option label.
     * @description Text shown to the user. Maximum 100 characters.
     */
    readonly label: string
    /**
     * @summary Option value.
     * @description Developer-defined value returned in the interaction. Maximum 100 characters.
     */
    readonly value: string
    /**
     * @summary Option description.
     * @description Additional text under the label. Maximum 100 characters.
     */
    readonly description?: string
    /**
     * @summary Option emoji.
     * @description Partial emoji shown beside the label (`name`, `id`, and optional `animated`).
     */
    readonly emoji?: IPartialEmoji
    /**
     * @summary Default selection.
     * @description When `true`, this option is selected when the menu opens.
     */
    readonly default?: boolean
}

export type { ISelectOption }
