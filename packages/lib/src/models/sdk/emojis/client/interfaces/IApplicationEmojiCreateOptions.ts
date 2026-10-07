/**
 * @summary Application emoji creation options.
 * @description Application POST requests accept name and image data, without guild roles or audit reasons.
 */
interface IApplicationEmojiCreateOptions {
    /**
     * @summary Custom name.
     * @description Nonempty emoji name; Discord enforces detailed naming restrictions.
     */
    readonly name: string
    /**
     * @summary Image data.
     * @description Base64 JPEG, PNG, GIF, WebP or AVIF URI containing at most 256 KiB.
     */
    readonly image: string
}

export type { IApplicationEmojiCreateOptions }
