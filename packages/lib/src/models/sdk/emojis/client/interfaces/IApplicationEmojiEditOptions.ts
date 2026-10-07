/**
 * @summary Application emoji rename options.
 * @description The application PATCH endpoint accepts a required name only.
 */
interface IApplicationEmojiEditOptions {
    /**
     * @summary New name.
     * @description Nonempty custom emoji name; Discord checks detailed naming restrictions.
     */
    readonly name: string
}

export type { IApplicationEmojiEditOptions }
