import { ButtonStyle } from "../../../../models/sdk/components/buttons/enums/ButtonStyle"
import type { InteractiveButtonStyle } from "../../../../models/sdk/components/buttons/types/InteractiveButtonStyle"
import type { IPartialEmoji } from "../../../../models/sdk/emojis/base/interfaces/IPartialEmoji"
import { BaseButton } from "../base/BaseButton"

/**
 * @summary Interactive Discord button.
 * @description Button with a `custom_id` and a primary, secondary, success, or danger style. Sends an interaction when clicked.
 * @example
 * ```ts
 * const button: InteractiveButton = new InteractiveButton()
 *     .setCustomId("confirm")
 *     .setStyle(ButtonStyle.SUCCESS)
 *     .setLabel("Confirm")
 *     .setEmoji({ id: null, name: "✅" })
 * ```
 */
class InteractiveButton extends BaseButton {
    /**
     * @summary Developer-defined button identifier.
     * @description Returned in the interaction payload when the button is clicked. Must be 1–100 characters.
     */
    private customId: string = ""

    /**
     * @summary Interactive button style.
     * @description One of primary, secondary, success, or danger. Link and premium styles are not allowed.
     */
    private style: InteractiveButtonStyle = ButtonStyle.PRIMARY

    /**
     * @summary Button label.
     * @description Text shown on the button. Design guidelines cap this at 34 characters with an emoji and 38 without (API maximum 80).
     */
    private label: string | undefined

    /**
     * @summary Button emoji.
     * @description Partial emoji shown alongside the label (`name`, `id`, and optional `animated`).
     */
    private emoji: IPartialEmoji | undefined

    /**
     * @summary Creates an interactive button.
     * @description Requires a `custom_id` and a non-link, non-premium style.
     * @param customId - Developer-defined identifier, 1–100 characters.
     * @param style - Primary, secondary, success, or danger style.
     */
    public constructor() {
        super()
    }

    /**
     * @summary Gets the custom identifier.
     * @description Developer-defined `custom_id` sent back when the button is used.
     * @returns The custom identifier.
     */
    public getCustomId(): string {
        return this.customId
    }

    /**
     * @summary Sets the custom identifier.
     * @description Replaces `custom_id`. Must be 1–100 characters.
     * @param customId - Developer-defined identifier.
     * @returns This button for chaining.
     */
    public setCustomId(customId: string): this {
        this.customId = InteractiveButton.assertCustomId(customId)
        return this
    }

    /**
     * @summary Gets the button style.
     * @description Returns the interactive style currently applied to this button.
     * @returns The interactive button style.
     */
    public getStyle(): InteractiveButtonStyle {
        return this.style
    }

    /**
     * @summary Sets the button style.
     * @description Accepts primary, secondary, success, or danger only. Link and premium styles are rejected.
     * @param style - Interactive button style.
     * @returns This button for chaining.
     */
    public setStyle(style: InteractiveButtonStyle): this {
        this.style = InteractiveButton.assertStyle(style)
        return this
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
     * @description Text that appears on the button. At most 34 characters with an emoji, or 38 without.
     * @param label - Button label text.
     * @returns This button for chaining.
     */
    public setLabel(label: string): this {
        this.label = InteractiveButton.assertLabel(label, this.emoji !== undefined)
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
        if (this.label !== undefined) InteractiveButton.assertLabel(this.label, true)
        this.emoji = emoji
        return this
    }

    /**
     * @summary Converts the button to a JSON object.
     * @description Builds a Discord button payload with `custom_id` and an interactive style.
     * @returns The JSON object representation of the button.
     */
    public toJSON(): Record<string, unknown> {
        const payload: Record<string, unknown> = {
            ...this.toBaseJSON(),
            style: InteractiveButton.assertStyle(this.style),
            custom_id: InteractiveButton.assertCustomId(this.customId),
        }

        InteractiveButton.assertLabelOrEmoji(this.label, this.emoji)
        if (this.label !== undefined) payload.label = this.label
        if (this.emoji !== undefined) payload.emoji = this.emoji
        return payload
    }

    /**
     * @summary Validates a custom identifier.
     * @description Ensures `custom_id` is a string of 1–100 characters.
     * @param customId - Candidate custom identifier.
     * @returns The validated custom identifier.
     */
    private static assertCustomId(customId: string): string {
        if (typeof customId !== "string") throw new TypeError("Button custom_id must be a string.")
        if (customId.length < 1 || customId.length > 100) {
            throw new RangeError("Button custom_id must be between 1 and 100 characters.")
        }
        return customId
    }

    /**
     * @summary Validates an interactive style.
     * @description Rejects link and premium styles, which belong on other button classes.
     * @param style - Candidate button style.
     * @returns The validated interactive style.
     */
    private static assertStyle(style: InteractiveButtonStyle): InteractiveButtonStyle {
        if (
            style !== ButtonStyle.PRIMARY &&
            style !== ButtonStyle.SECONDARY &&
            style !== ButtonStyle.SUCCESS &&
            style !== ButtonStyle.DANGER
        ) {
            throw new TypeError("Interactive buttons cannot use link or premium styles.")
        }
        return style
    }
}

export { InteractiveButton }
