import { ComponentType } from "../../../models/sdk/components/base/enums/ComponentType"
import { BaseComponent } from "../base/BaseComponent"

/**
 * @summary Discord checkbox for a yes/no modal choice.
 * @description Interactive single checkbox for modals. Must be placed inside a Label. Cannot be marked required; use a Checkbox Group with one option and `required` for that behavior.
 * @example
 * ```ts
 * const checkbox: Checkbox = new Checkbox()
 *     .setCustomId("like_checkbox")
 *     .setDefault(false)
 * ```
 */
class Checkbox extends BaseComponent {
    /**
     * @summary The type of the component.
     * @description Always `ComponentType.CHECKBOX` for checkbox payloads sent to Discord.
     */
    protected static override readonly componentType: ComponentType = ComponentType.CHECKBOX

    /**
     * @summary Maximum length of `custom_id`.
     * @description Discord allows 1–100 characters for checkbox identifiers.
     */
    private static readonly MAX_CUSTOM_ID_LENGTH: number = 100

    /**
     * @summary Developer-defined checkbox identifier.
     * @description Returned in the interaction payload when the modal is submitted. Must be 1–100 characters.
     */
    private customId: string = ""

    /**
     * @summary Default checked state.
     * @description Whether the checkbox is selected when the modal opens. Omitted from the payload when unset.
     */
    private default?: boolean

    /**
     * @summary Creates a checkbox.
     * @description Starts unchecked-by-omission with no `custom_id`. Set an identifier with {@link Checkbox.setCustomId} before sending.
     */
    public constructor() {
        super()
    }

    /**
     * @summary Gets the custom identifier.
     * @description Developer-defined `custom_id` sent back when the modal is submitted.
     * @returns The custom identifier.
     */
    public getCustomId(): string {
        return this.customId
    }

    /**
     * @summary Sets the custom identifier.
     * @description Replaces `custom_id`. Must be 1–100 characters.
     * @param customId - Developer-defined identifier.
     * @returns This checkbox for chaining.
     */
    public setCustomId(customId: string): this {
        this.customId = Checkbox.assertCustomId(customId)
        return this
    }

    /**
     * @summary Gets the default checked state.
     * @description Returns whether the checkbox starts selected, or `undefined` when omitted from the payload.
     * @returns The default state, or `undefined` if unset.
     */
    public getDefault(): boolean | undefined {
        return this.default
    }

    /**
     * @summary Sets the default checked state.
     * @description Marks the checkbox as selected when the modal opens if `true`.
     * @param isDefault - Whether the checkbox is selected by default.
     * @returns This checkbox for chaining.
     */
    public setDefault(isDefault: boolean): this {
        this.default = isDefault
        return this
    }

    /**
     * @summary Converts the checkbox to a JSON object.
     * @description Builds a Discord checkbox payload with `type` `23`, required `custom_id`, and optional `default`.
     * @returns The JSON object representation of the checkbox.
     */
    public toJSON(): Record<string, unknown> {
        const payload: Record<string, unknown> = {
            type: Checkbox.componentType,
            custom_id: Checkbox.assertCustomId(this.customId),
        }
        if (this.id !== undefined) payload.id = this.id
        if (this.default !== undefined) payload.default = this.default
        return payload
    }

    /**
     * @summary Validates a custom identifier.
     * @description Ensures `custom_id` is a string of 1–100 characters.
     * @param customId - Candidate custom identifier.
     * @returns The validated custom identifier.
     */
    private static assertCustomId(customId: string): string {
        if (typeof customId !== "string") throw new TypeError("Checkbox custom_id must be a string.")
        if (customId.length < 1 || customId.length > Checkbox.MAX_CUSTOM_ID_LENGTH) {
            throw new RangeError("Checkbox custom_id must be between 1 and 100 characters.")
        }
        return customId
    }
}

export { Checkbox }
