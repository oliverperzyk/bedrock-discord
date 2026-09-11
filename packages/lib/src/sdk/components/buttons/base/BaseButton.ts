import { ComponentType } from "../../../../models/sdk/components/base/enums/ComponentType"
import type { IPartialEmoji } from "../../../../models/sdk/emojis/base/interfaces/IPartialEmoji"
import { BaseComponent } from "../../base/BaseComponent"

/**
 * @summary Base Discord button.
 * @description Shared optional component `id` and `disabled` flag for all button styles. Concrete subclasses add style-specific fields.
 * @example
 * ```ts
 * const button = new InteractiveButton("click_me", ButtonStyle.PRIMARY)
 * button.setDisabled(true).setId(2)
 * ```
 */
abstract class BaseButton extends BaseComponent {
    /**
     * @summary The type of the component.
     * @description Always `ComponentType.BUTTON` for button payloads sent to Discord.
     */
    protected static override readonly componentType: ComponentType = ComponentType.BUTTON

    /**
     * @summary Maximum label length with an emoji.
     * @description Discord design guidelines cap button text at 34 characters when an icon or emoji is present.
     */
    protected static readonly MAX_LABEL_LENGTH_WITH_EMOJI: number = 34

    /**
     * @summary Maximum label length without an emoji.
     * @description Discord design guidelines cap button text at 38 characters when no icon or emoji is present. The API still allows up to 80.
     */
    protected static readonly MAX_LABEL_LENGTH_WITHOUT_EMOJI: number = 38

    /**
     * @summary Absolute API maximum label length.
     * @description Discord button `label` field maximum, independent of design guidelines.
     */
    protected static readonly MAX_LABEL_LENGTH: number = 80

    /**
     * @summary Disabled state.
     * @description Whether the button is non-interactive. Discord defaults this to `false` when omitted.
     */
    private disabled?: boolean

    /**
     * @summary Gets whether the button is disabled.
     * @description Returns the disabled flag, or `undefined` when the field should be omitted from the payload.
     * @returns Whether the button is disabled, or `undefined` if unset.
     */
    public getDisabled(): boolean | undefined {
        return this.disabled
    }

    /**
     * @summary Sets whether the button is disabled.
     * @description Marks the button as non-interactive when `true`. Discord defaults to `false` if this field is omitted.
     * @param disabled - Whether the button is disabled.
     * @returns This button for chaining.
     */
    public setDisabled(disabled: boolean): this {
        this.disabled = disabled
        return this
    }

    /**
     * @summary Shared fields present on every button payload.
     * @description Includes `type` plus optional `id` and `disabled` when they have been set.
     * @returns Partial JSON fields common to all button styles.
     */
    protected toBaseJSON(): Record<string, unknown> {
        const payload: Record<string, unknown> = {
            type: BaseButton.componentType,
        }
        if (this.id !== undefined) payload.id = this.id
        if (this.disabled !== undefined) payload.disabled = this.disabled
        return payload
    }

    /**
     * @summary Validates a button label.
     * @description Ensures the label is a non-empty string within Discord's 80-character API cap and the design-guideline cap of 34 characters with an emoji or 38 without.
     * @param label - Candidate label.
     * @param hasEmoji - Whether the button also has an emoji or icon.
     * @returns The validated label.
     */
    protected static assertLabel(label: string, hasEmoji: boolean): string {
        if (typeof label !== "string") throw new TypeError("Button label must be a string.")
        if (label.length < 1) throw new RangeError("Button label must be a non-empty string.")
        if (label.length > BaseButton.MAX_LABEL_LENGTH) {
            throw new RangeError("Button label must be at most 80 characters.")
        }
        const maxLength: number = hasEmoji
            ? BaseButton.MAX_LABEL_LENGTH_WITH_EMOJI
            : BaseButton.MAX_LABEL_LENGTH_WITHOUT_EMOJI
        if (label.length > maxLength) {
            throw new RangeError(
                hasEmoji
                    ? "Button label must be at most 34 characters when an emoji is set."
                    : "Button label must be at most 38 characters when no emoji is set.",
            )
        }
        return label
    }

    /**
     * @summary Validates that a button has visible content.
     * @description Non-premium buttons need a label, an emoji, or both. Re-checks the label against the emoji-aware length cap.
     * @param label - Candidate label, if any.
     * @param emoji - Candidate emoji, if any.
     */
    protected static assertLabelOrEmoji(label: string | undefined, emoji: IPartialEmoji | undefined): void {
        if (label === undefined && emoji === undefined) {
            throw new TypeError("Button must have a label, an emoji, or both.")
        }
        if (label !== undefined) BaseButton.assertLabel(label, emoji !== undefined)
    }
}

export { BaseButton }
