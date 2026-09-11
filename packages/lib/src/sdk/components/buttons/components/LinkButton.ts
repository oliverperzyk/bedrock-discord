import { ButtonStyle } from "../../../../models/sdk/components/buttons/enums/ButtonStyle"
import type { IPartialEmoji } from "../../../../models/sdk/emojis/base/interfaces/IPartialEmoji"
import { BaseButton } from "../base/BaseButton"

/**
 * @summary Link Discord button.
 * @description Button that navigates to a URL. Requires `url`, cannot have `custom_id`, and does not send an interaction.
 * @example
 * ```ts
 * const button: LinkButton = new LinkButton()
 *     .setUrl("https://discord.com")
 *     .setLabel("Open Discord")
 * ```
 */
class LinkButton extends BaseButton {
    /**
     * @summary Destination URL.
     * @description URL opened when the button is clicked. Maximum 512 characters.
     */
    private url: string = ""

    /**
     * @summary Button label.
     * @description Text shown on the button; maximum 80 characters.
     */
    private label?: string

    /**
     * @summary Button emoji.
     * @description Partial emoji shown alongside the label (`name`, `id`, and optional `animated`).
     */
    private emoji?: IPartialEmoji

    /**
     * @summary Creates a link button.
     * @description Requires a destination URL. Style is always `ButtonStyle.LINK`.
     * @param url - Destination URL, maximum 512 characters.
     */
    public constructor() {
        super()
    }

    /**
     * @summary Gets the destination URL.
     * @description URL opened when the button is clicked.
     * @returns The destination URL.
     */
    public getUrl(): string {
        return this.url
    }

    /**
     * @summary Sets the destination URL.
     * @description Replaces `url`. Maximum 512 characters.
     * @param url - Destination URL.
     * @returns This button for chaining.
     */
    public setUrl(url: string): this {
        this.url = LinkButton.assertUrl(url)
        return this
    }

    /**
     * @summary Gets the button style.
     * @description Link buttons always use `ButtonStyle.LINK`.
     * @returns The link button style.
     */
    public getStyle(): ButtonStyle.LINK {
        return ButtonStyle.LINK
    }

    /**
     * @summary Gets the button label.
     * @description Returns the visible label, or `undefined` when unset.
     * @returns The label, or `undefined` if unset.
     */
    public getLabel(): string | undefined {
        return this.label
    }

    /**
     * @summary Sets the button label.
     * @description Text that appears on the button. Maximum 80 characters.
     * @param label - Button label text.
     * @returns This button for chaining.
     */
    public setLabel(label: string): this {
        this.label = LinkButton.assertLabel(label)
        return this
    }

    /**
     * @summary Gets the button emoji.
     * @description Returns the partial emoji, or `undefined` when unset.
     * @returns The emoji, or `undefined` if unset.
     */
    public getEmoji(): IPartialEmoji | undefined {
        return this.emoji
    }

    /**
     * @summary Sets the button emoji.
     * @description Partial emoji (`name`, `id`, and optional `animated`) shown on the button.
     * @param emoji - Partial emoji payload.
     * @returns This button for chaining.
     */
    public setEmoji(emoji: IPartialEmoji): this {
        this.emoji = emoji
        return this
    }

    /**
     * @summary Converts the button to a JSON object.
     * @description Builds a Discord button payload with `url` and link style.
     * @returns The JSON object representation of the button.
     */
    public toJSON(): Record<string, unknown> {
        const payload: Record<string, unknown> = {
            ...this.toBaseJSON(),
            style: ButtonStyle.LINK,
            url: LinkButton.assertUrl(this.url),
        }
        if (this.label !== undefined) payload.label = this.label
        if (this.emoji !== undefined) payload.emoji = this.emoji
        return payload
    }

    /**
     * @summary Validates a destination URL.
     * @description Ensures `url` is a string of at most 512 characters.
     * @param url - Candidate URL.
     * @returns The validated URL.
     */
    private static assertUrl(url: string): string {
        if (typeof url !== "string") throw new TypeError("Link button url must be a string.")
        if (url.length < 1 || url.length > 512) {
            throw new RangeError("Link button url must be between 1 and 512 characters.")
        }
        return url
    }

    /**
     * @summary Validates a button label.
     * @description Ensures the label is a string of at most 80 characters.
     * @param label - Candidate label.
     * @returns The validated label.
     */
    private static assertLabel(label: string): string {
        if (typeof label !== "string") throw new TypeError("Button label must be a string.")
        if (label.length > 80) throw new RangeError("Button label must be at most 80 characters.")
        return label
    }
}

export { LinkButton }
