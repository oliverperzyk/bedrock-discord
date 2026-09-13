import { ComponentType } from "../../../models/sdk/components/base/enums/ComponentType"
import { TextInputStyle } from "../../../models/sdk/components/input/enums/TextInputStyle"
import { BaseComponent } from "../base/BaseComponent"

/**
 * @summary Discord text input for free-form modal answers.
 * @description Interactive component for modals. Prefer placing it in a Label; wrapping a text input in an Action Row is deprecated. The `label` field on the input itself is deprecated in favor of Label `label` and `description`.
 * @example
 * ```ts
 * const input: TextInput = new TextInput()
 *     .setCustomId("game_feedback")
 *     .setStyle(TextInputStyle.PARAGRAPH)
 *     .setMinLength(100)
 *     .setMaxLength(4000)
 *     .setPlaceholder("Write your feedback here...")
 *     .setRequired(true)
 * ```
 */
class TextInput extends BaseComponent {
    /**
     * @summary The type of the component.
     * @description Always `ComponentType.TEXT_INPUT` for text input payloads sent to Discord.
     */
    protected static override readonly componentType: ComponentType = ComponentType.TEXT_INPUT

    /**
     * @summary Maximum length of `custom_id`.
     * @description Discord allows 1–100 characters for text input identifiers.
     */
    private static readonly MAX_CUSTOM_ID_LENGTH: number = 100

    /**
     * @summary Maximum length of placeholder text.
     * @description Discord caps text input `placeholder` at 100 characters.
     */
    private static readonly MAX_PLACEHOLDER_LENGTH: number = 100

    /**
     * @summary Maximum length of entered or pre-filled text.
     * @description Discord caps `value`, `min_length`, and `max_length` at 4000 characters.
     */
    private static readonly MAX_VALUE_LENGTH: number = 4000

    /**
     * @summary Developer-defined input identifier.
     * @description Returned in the interaction payload when the modal is submitted. Must be 1–100 characters.
     */
    private customId: string = ""

    /**
     * @summary Input style.
     * @description Short (single-line) or paragraph (multi-line). Defaults to short.
     */
    private style: TextInputStyle = TextInputStyle.SHORT

    /**
     * @summary Minimum input length.
     * @description Integer from 0 to 4000. Omitted from the payload when unset.
     */
    private minLength?: number

    /**
     * @summary Maximum input length.
     * @description Integer from 1 to 4000. Omitted from the payload when unset.
     */
    private maxLength?: number

    /**
     * @summary Whether the field must be filled.
     * @description Discord defaults this to `true` when omitted.
     */
    private required?: boolean

    /**
     * @summary Pre-filled value.
     * @description Initial text shown in the field. At most 4000 characters. Omitted from the payload when unset.
     */
    private value?: string

    /**
     * @summary Placeholder text.
     * @description Shown when the field is empty. At most 100 characters. Omitted from the payload when unset.
     */
    private placeholder?: string

    /**
     * @summary Creates a text input.
     * @description Starts as a short input with no `custom_id`. Set an identifier with {@link TextInput.setCustomId} before sending.
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
     * @returns This text input for chaining.
     */
    public setCustomId(customId: string): this {
        this.customId = TextInput.assertCustomId(customId)
        return this
    }

    /**
     * @summary Gets the input style.
     * @description Returns short or paragraph.
     * @returns The text input style.
     */
    public getStyle(): TextInputStyle {
        return this.style
    }

    /**
     * @summary Sets the input style.
     * @description `TextInputStyle.SHORT` for a single line or `TextInputStyle.PARAGRAPH` for multiple lines.
     * @param style - Text input style.
     * @returns This text input for chaining.
     */
    public setStyle(style: TextInputStyle): this {
        this.style = TextInput.assertStyle(style)
        return this
    }

    /**
     * @summary Gets the minimum input length.
     * @description Returns `min_length`, or `undefined` when omitted from the payload.
     * @returns The minimum length, or `undefined` if unset.
     */
    public getMinLength(): number | undefined {
        return this.minLength
    }

    /**
     * @summary Sets the minimum input length.
     * @description Must be an integer from 0 to 4000.
     * @param minLength - Minimum number of characters.
     * @returns This text input for chaining.
     */
    public setMinLength(minLength: number): this {
        this.minLength = TextInput.assertMinLength(minLength)
        return this
    }

    /**
     * @summary Gets the maximum input length.
     * @description Returns `max_length`, or `undefined` when omitted from the payload.
     * @returns The maximum length, or `undefined` if unset.
     */
    public getMaxLength(): number | undefined {
        return this.maxLength
    }

    /**
     * @summary Sets the maximum input length.
     * @description Must be an integer from 1 to 4000.
     * @param maxLength - Maximum number of characters.
     * @returns This text input for chaining.
     */
    public setMaxLength(maxLength: number): this {
        this.maxLength = TextInput.assertMaxLength(maxLength)
        return this
    }

    /**
     * @summary Gets whether the field is required.
     * @description Returns the required flag, or `undefined` when omitted from the payload.
     * @returns Whether the field is required, or `undefined` if unset.
     */
    public getRequired(): boolean | undefined {
        return this.required
    }

    /**
     * @summary Sets whether the field is required.
     * @description Discord defaults to `true` when this field is omitted.
     * @param required - Whether the field must be filled.
     * @returns This text input for chaining.
     */
    public setRequired(required: boolean): this {
        this.required = required
        return this
    }

    /**
     * @summary Gets the pre-filled value.
     * @description Returns the initial text, or `undefined` when unset.
     * @returns The pre-filled value, or `undefined` if unset.
     */
    public getValue(): string | undefined {
        return this.value
    }

    /**
     * @summary Sets the pre-filled value.
     * @description Initial text shown in the field. Maximum 4000 characters.
     * @param value - Pre-filled text.
     * @returns This text input for chaining.
     */
    public setValue(value: string): this {
        this.value = TextInput.assertValue(value)
        return this
    }

    /**
     * @summary Gets the placeholder text.
     * @description Returns the placeholder, or `undefined` when unset.
     * @returns The placeholder, or `undefined` if unset.
     */
    public getPlaceholder(): string | undefined {
        return this.placeholder
    }

    /**
     * @summary Sets the placeholder text.
     * @description Shown when the field is empty. Maximum 100 characters.
     * @param placeholder - Placeholder text.
     * @returns This text input for chaining.
     */
    public setPlaceholder(placeholder: string): this {
        this.placeholder = TextInput.assertPlaceholder(placeholder)
        return this
    }

    /**
     * @summary Converts the text input to a JSON object.
     * @description Builds a Discord text input payload with `type` `4`, required `custom_id` and `style`, and optional length, required, value, and placeholder fields.
     * @returns The JSON object representation of the text input.
     */
    public toJSON(): Record<string, unknown> {
        const minLength: number | undefined = this.minLength
        const maxLength: number | undefined = this.maxLength
        if (minLength !== undefined && maxLength !== undefined && minLength > maxLength) {
            throw new RangeError("Text input min_length cannot be greater than max_length.")
        }

        const payload: Record<string, unknown> = {
            type: TextInput.componentType,
            custom_id: TextInput.assertCustomId(this.customId),
            style: TextInput.assertStyle(this.style),
        }
        if (this.id !== undefined) payload.id = this.id
        if (minLength !== undefined) payload.min_length = minLength
        if (maxLength !== undefined) payload.max_length = maxLength
        if (this.required !== undefined) payload.required = this.required
        if (this.value !== undefined) payload.value = this.value
        if (this.placeholder !== undefined) payload.placeholder = this.placeholder
        return payload
    }

    /**
     * @summary Validates a custom identifier.
     * @description Ensures `custom_id` is a string of 1–100 characters.
     * @param customId - Candidate custom identifier.
     * @returns The validated custom identifier.
     */
    private static assertCustomId(customId: string): string {
        if (typeof customId !== "string") throw new TypeError("Text input custom_id must be a string.")
        if (customId.length < 1 || customId.length > TextInput.MAX_CUSTOM_ID_LENGTH) {
            throw new RangeError("Text input custom_id must be between 1 and 100 characters.")
        }
        return customId
    }

    /**
     * @summary Validates text input style.
     * @description Ensures the value is `TextInputStyle.SHORT` or `TextInputStyle.PARAGRAPH`.
     * @param style - Candidate style.
     * @returns The validated style.
     */
    private static assertStyle(style: TextInputStyle): TextInputStyle {
        if (style !== TextInputStyle.SHORT && style !== TextInputStyle.PARAGRAPH) {
            throw new RangeError("Text input style must be TextInputStyle.SHORT or TextInputStyle.PARAGRAPH.")
        }
        return style
    }

    /**
     * @summary Validates `min_length`.
     * @description Ensures the value is an integer from 0 to 4000.
     * @param minLength - Candidate minimum.
     * @returns The validated minimum.
     */
    private static assertMinLength(minLength: number): number {
        if (!Number.isInteger(minLength) || minLength < 0 || minLength > TextInput.MAX_VALUE_LENGTH) {
            throw new RangeError("Text input min_length must be an integer between 0 and 4000.")
        }
        return minLength
    }

    /**
     * @summary Validates `max_length`.
     * @description Ensures the value is an integer from 1 to 4000.
     * @param maxLength - Candidate maximum.
     * @returns The validated maximum.
     */
    private static assertMaxLength(maxLength: number): number {
        if (!Number.isInteger(maxLength) || maxLength < 1 || maxLength > TextInput.MAX_VALUE_LENGTH) {
            throw new RangeError("Text input max_length must be an integer between 1 and 4000.")
        }
        return maxLength
    }

    /**
     * @summary Validates a pre-filled value.
     * @description Ensures the value is a string of at most 4000 characters.
     * @param value - Candidate value.
     * @returns The validated value.
     */
    private static assertValue(value: string): string {
        if (typeof value !== "string") throw new TypeError("Text input value must be a string.")
        if (value.length > TextInput.MAX_VALUE_LENGTH) {
            throw new RangeError("Text input value must be at most 4000 characters.")
        }
        return value
    }

    /**
     * @summary Validates placeholder text.
     * @description Ensures the placeholder is a string of at most 100 characters.
     * @param placeholder - Candidate placeholder.
     * @returns The validated placeholder.
     */
    private static assertPlaceholder(placeholder: string): string {
        if (typeof placeholder !== "string") throw new TypeError("Text input placeholder must be a string.")
        if (placeholder.length > TextInput.MAX_PLACEHOLDER_LENGTH) {
            throw new RangeError("Text input placeholder must be at most 100 characters.")
        }
        return placeholder
    }
}

export { TextInput, TextInputStyle }
