import { ComponentType } from "../../../../models/sdk/components/base/enums/ComponentType"
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
            type: (this.constructor as typeof BaseButton).componentType,
        }
        if (this.id !== undefined) payload.id = this.id
        if (this.disabled !== undefined) payload.disabled = this.disabled
        return payload
    }
}

export { BaseButton }
