import { ComponentType } from "../../../models/sdk/components/base/enums/ComponentType"
import { BaseComponent } from "../base/BaseComponent"
import { MediaGalleryItem } from "../display/MediaGalleryItem"

/**
 * @summary Discord media gallery to display images and other media.
 * @description Top-level content component for messages. Holds 1–10 {@link MediaGalleryItem} entries. Requires the `IS_COMPONENTS_V2` message flag (`1 << 15`).
 * @example
 * ```ts
 * const gallery: MediaGallery = new MediaGallery()
 *     .addItems(
 *         new MediaGalleryItem()
 *             .setURL("https://example.com/webcam.webp")
 *             .setDescription("Live webcam feed."),
 *         new MediaGalleryItem().setURL("attachment://shot.png"),
 *     )
 * ```
 */
class MediaGallery extends BaseComponent {
    /**
     * @summary The type of the component.
     * @description Always `ComponentType.MEDIA_GALLERY` for media gallery payloads sent to Discord.
     */
    protected static override readonly componentType: ComponentType = ComponentType.MEDIA_GALLERY

    /**
     * @summary Maximum number of gallery items.
     * @description Discord allows at most 10 media gallery items.
     */
    private static readonly MAX_ITEMS: number = 10

    /**
     * @summary Items in this gallery.
     * @description Media entries shown in the gallery. At least one and at most 10 when serializing.
     */
    private items: MediaGalleryItem[] = []

    /**
     * @summary Creates a media gallery.
     * @description Starts with no items. Add items with {@link MediaGallery.addItems} or {@link MediaGallery.setItems} before sending.
     */
    public constructor() {
        super()
    }

    /**
     * @summary Gets the gallery items.
     * @description Returns a copy of the items currently in this gallery.
     * @returns The items in insertion order.
     */
    public getItems(): MediaGalleryItem[] {
        return this.items.slice()
    }

    /**
     * @summary Appends gallery items.
     * @description Adds {@link MediaGalleryItem} builders to the end of the gallery. Combined length cannot exceed 10.
     * @param items - Items to append.
     * @returns This gallery for chaining.
     */
    public addItems(...items: MediaGalleryItem[]): this {
        this.items = MediaGallery.assertItems(this.items.concat(items))
        return this
    }

    /**
     * @summary Replaces all gallery items.
     * @description Overwrites the gallery contents. Pass 1–10 items before serializing.
     * @param items - Items that become the full gallery.
     * @returns This gallery for chaining.
     */
    public setItems(...items: MediaGalleryItem[]): this {
        this.items = MediaGallery.assertItems(items)
        return this
    }

    /**
     * @summary Converts the gallery to a JSON object.
     * @description Builds a Discord media gallery payload with `type` `12` and serialized items.
     * @returns The JSON object representation of the gallery.
     */
    public toJSON(): Record<string, unknown> {
        const items: MediaGalleryItem[] = MediaGallery.assertItems(this.items, true)
        const payload: Record<string, unknown> = {
            type: (this.constructor as typeof MediaGallery).componentType,
            items: items.map((item: MediaGalleryItem) => item.toJSON()),
        }
        if (this.id !== undefined) payload.id = this.id
        return payload
    }

    /**
     * @summary Validates gallery items.
     * @description Ensures children are {@link MediaGalleryItem} builders and the list stays within Discord's 1–10 limit.
     * @param items - Candidate gallery items.
     * @param requireNonEmpty - When `true`, rejects an empty gallery (used when serializing).
     * @returns The validated item list.
     */
    private static assertItems(
        items: readonly MediaGalleryItem[],
        requireNonEmpty: boolean = false,
    ): MediaGalleryItem[] {
        if (!Array.isArray(items)) throw new TypeError("Media gallery items must be an array.")
        if (requireNonEmpty && items.length < 1) {
            throw new RangeError("Media gallery must contain at least one item.")
        }
        if (items.length > MediaGallery.MAX_ITEMS) {
            throw new RangeError("Media gallery can contain at most 10 items.")
        }
        for (const item of items) {
            if (!(item instanceof MediaGalleryItem)) {
                throw new TypeError("Media gallery items must be MediaGalleryItem builders.")
            }
        }
        return items.slice()
    }
}

export { MediaGallery }
