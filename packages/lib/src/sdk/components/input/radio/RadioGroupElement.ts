/**
 * @summary Single choice in a radio group.
 * @description Nested radio option payload (not a Discord component type). Holds a developer `value`, user-facing `label`, and optional description and default. Place elements on {@link RadioGroup}.
 * @example
 * ```ts
 * const option: RadioGroupElement = new RadioGroupElement()
 *     .setValue("warrior")
 *     .setLabel("Warrior")
 *     .setDescription("Strong and brave")
 * ```
 */
class RadioGroupElement {
    /**
     * @summary Maximum length of option strings.
     * @description Discord caps radio option `value`, `label`, and `description` at 100 characters.
     */
    private static readonly MAX_TEXT_LENGTH: number = 100

    /**
     * @summary Developer-defined option value.
     * @description Returned in the interaction when this option is selected. Required when serializing.
     */
    private value?: string

    /**
     * @summary User-facing option label.
     * @description Text shown next to the radio. Required when serializing.
     */
    private label?: string

    /**
     * @summary Option description.
     * @description Additional text under the label. At most 100 characters. Omitted from the payload when unset.
     */
    private description?: string

    /**
     * @summary Default selection.
     * @description Whether this option is selected when the modal opens. Omitted from the payload when unset.
     */
    private default?: boolean

    /**
     * @summary Creates a radio group option.
     * @description Starts with no value or label. Set both with {@link RadioGroupElement.setValue} and {@link RadioGroupElement.setLabel} before sending.
     */
    public constructor() {}

    /**
     * @summary Gets the option value.
     * @description Returns the developer-defined value, or `undefined` when unset.
     * @returns The value, or `undefined` if unset.
     */
    public getValue(): string | undefined {
        return this.value
    }

    /**
     * @summary Sets the option value.
     * @description Developer-defined string returned on submit. Maximum 100 characters.
     * @param value - Option value.
     * @returns This element for chaining.
     */
    public setValue(value: string): this {
        this.value = RadioGroupElement.assertText("value", value)
        return this
    }

    /**
     * @summary Gets the option label.
     * @description Returns the user-facing label, or `undefined` when unset.
     * @returns The label, or `undefined` if unset.
     */
    public getLabel(): string | undefined {
        return this.label
    }

    /**
     * @summary Sets the option label.
     * @description Text shown to the user. Maximum 100 characters.
     * @param label - Option label.
     * @returns This element for chaining.
     */
    public setLabel(label: string): this {
        this.label = RadioGroupElement.assertText("label", label)
        return this
    }

    /**
     * @summary Gets the option description.
     * @description Returns the description, or `undefined` when omitted from the payload.
     * @returns The description, or `undefined` if unset.
     */
    public getDescription(): string | undefined {
        return this.description
    }

    /**
     * @summary Sets the option description.
     * @description Additional text under the label. Maximum 100 characters.
     * @param description - Option description.
     * @returns This element for chaining.
     */
    public setDescription(description: string): this {
        this.description = RadioGroupElement.assertText("description", description)
        return this
    }

    /**
     * @summary Gets whether this option is the default.
     * @description Returns the default flag, or `undefined` when omitted from the payload.
     * @returns Whether this option is selected by default, or `undefined` if unset.
     */
    public getDefault(): boolean | undefined {
        return this.default
    }

    /**
     * @summary Sets whether this option is the default.
     * @description Marks the option as selected when the modal opens if `true`.
     * @param isDefault - Whether this option is selected by default.
     * @returns This element for chaining.
     */
    public setDefault(isDefault: boolean): this {
        this.default = isDefault
        return this
    }

    /**
     * @summary Converts the option to a JSON object.
     * @description Builds a Discord radio group option with required `value` and `label`, plus optional `description` and `default`.
     * @returns The JSON object representation of the option.
     */
    public toJSON(): Record<string, unknown> {
        const payload: Record<string, unknown> = {
            value: RadioGroupElement.assertText("value", this.value),
            label: RadioGroupElement.assertText("label", this.label),
        }
        if (this.description !== undefined) payload.description = this.description
        if (this.default !== undefined) payload.default = this.default
        return payload
    }

    /**
     * @summary Validates an option string field.
     * @description Ensures the field is a non-empty string of at most 100 characters.
     * @param field - Field name for error messages.
     * @param value - Candidate string.
     * @returns The validated string.
     */
    private static assertText(field: string, value: string | undefined): string {
        if (typeof value !== "string") {
            throw new TypeError(`Radio group option ${field} must be a string.`)
        }
        if (value.length < 1 || value.length > RadioGroupElement.MAX_TEXT_LENGTH) {
            throw new RangeError(`Radio group option ${field} must be between 1 and 100 characters.`)
        }
        return value
    }
}

export { RadioGroupElement }
