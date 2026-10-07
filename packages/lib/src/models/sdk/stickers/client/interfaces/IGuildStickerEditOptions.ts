/**
 * @summary Guild sticker edit options.
 * @description Only supplied metadata fields are sent in the JSON PATCH payload.
 */
interface IGuildStickerEditOptions {
    /**
     * @summary Sticker name.
     * @description When supplied, must contain 2 to 30 characters.
     */
    readonly name?: string
    /**
     * @summary Description.
     * @description Null clears the description; strings must contain 2 to 100 characters.
     */
    readonly description?: string | null
    /**
     * @summary Suggestion tags.
     * @description When supplied, must contain at most 200 characters.
     */
    readonly tags?: string
    /**
     * @summary Audit reason.
     * @description Optional explanation sent as a header, never in the JSON body.
     */
    readonly reason?: string
}

export type { IGuildStickerEditOptions }
