import type { IUnfurledMediaItem } from "../../../models/sdk/components/display/unfurled-media/interfaces/IUnfurledMediaItem"

/**
 * @summary Single image or media entry in a media gallery.
 * @description Nested gallery payload (not a Discord component type). Holds an unfurled media URL plus optional alt text and spoiler. Place items on {@link MediaGallery}.
 * @example
 * ```ts
 * const item: MediaGalleryItem = new MediaGalleryItem()
 *     .setURL("https://example.com/webcam.webp")
 *     .setDescription("An aerial view of the industrial complex.")
 * ```
 */
class MediaGalleryItem {
    /**
     * @summary Maximum alt text length.
     * @description Discord caps media gallery item `description` at 1024 characters.
     */
    private static readonly MAX_DESCRIPTION_LENGTH: number = 1024

    /**
     * @summary Media URL.
     * @description Arbitrary URL or `attachment://filename`. Required when serializing.
     */
    private url?: string

    /**
     * @summary Alt text for the media.
     * @description Optional description, at most 1024 characters, or `null` to send an empty description. Omitted from the payload when unset.
     */
    private description?: string | null

    /**
     * @summary Spoiler state.
     * @description Whether the media is blurred until revealed. Discord defaults this to `false` when omitted.
     */
    private spoiler?: boolean

    /**
     * @summary Creates a media gallery item.
     * @description Starts with no URL, description, or spoiler. Set a URL with {@link MediaGalleryItem.setURL} before sending.
     */
    public constructor() {}

    /**
     * @summary Gets the media URL.
     * @description Returns the unfurled media URL, or `undefined` when unset.
     * @returns The media URL, or `undefined` if unset.
     */
    public getURL(): string | undefined {
        return this.url
    }

    /**
     * @summary Sets the media URL.
     * @description Arbitrary HTTPS URL or `attachment://filename` referencing an uploaded file.
     * @param url - Media URL.
     * @returns This item for chaining.
     */
    public setURL(url: string): this {
        this.url = MediaGalleryItem.assertURL(url)
        return this
    }

    /**
     * @summary Gets the alt text.
     * @description Returns the description, `null` when explicitly cleared, or `undefined` when omitted from the payload.
     * @returns The description, `null` if cleared, or `undefined` if unset.
     */
    public getDescription(): string | null | undefined {
        return this.description
    }

    /**
     * @summary Sets the alt text.
     * @description Description shown as alt text. Maximum 1024 characters. Pass `null` to send an empty description.
     * @param description - Alt text, or `null` to clear.
     * @returns This item for chaining.
     */
    public setDescription(description: string | null): this {
        this.description = MediaGalleryItem.assertDescription(description)
        return this
    }

    /**
     * @summary Gets whether the media is a spoiler.
     * @description Returns the spoiler flag, or `undefined` when the field should be omitted from the payload.
     * @returns Whether the media is a spoiler, or `undefined` if unset.
     */
    public getSpoiler(): boolean | undefined {
        return this.spoiler
    }

    /**
     * @summary Sets whether the media is a spoiler.
     * @description Marks the media as blurred until revealed when `true`.
     * @param spoiler - Whether the media is a spoiler.
     * @returns This item for chaining.
     */
    public setSpoiler(spoiler: boolean): this {
        this.spoiler = spoiler
        return this
    }

    /**
     * @summary Converts the item to a JSON object.
     * @description Builds a Discord media gallery item with required `media.url` and optional `description` and `spoiler`.
     * @returns The JSON object representation of the item.
     */
    public toJSON(): Record<string, unknown> {
        const media: IUnfurledMediaItem = { url: MediaGalleryItem.assertURL(this.url) }
        const payload: Record<string, unknown> = { media }
        if (this.description !== undefined) payload.description = this.description
        if (this.spoiler !== undefined) payload.spoiler = this.spoiler
        return payload
    }

    /**
     * @summary Validates the media URL.
     * @description Ensures the value is a non-empty string.
     * @param url - Candidate URL.
     * @returns The validated URL.
     */
    private static assertURL(url: string | undefined): string {
        if (typeof url !== "string" || url.length < 1) {
            throw new TypeError("Media gallery item url must be a non-empty string.")
        }
        return url
    }

    /**
     * @summary Validates alt text.
     * @description Ensures the value is `null` or a string of at most 1024 characters.
     * @param description - Candidate description.
     * @returns The validated description.
     */
    private static assertDescription(description: string | null): string | null {
        if (description === null) return null
        if (typeof description !== "string") {
            throw new TypeError("Media gallery item description must be a string or null.")
        }
        if (description.length > MediaGalleryItem.MAX_DESCRIPTION_LENGTH) {
            throw new RangeError("Media gallery item description must be at most 1024 characters.")
        }
        return description
    }
}

export { MediaGalleryItem }
