import { BaseComponent } from "../../base/BaseComponent"

/**
 * @summary Base Discord select menu.
 * @description Shared `custom_id`, placeholder, value limits, `required`, and `disabled` for every select type. Concrete subclasses add options, default values, or channel types.
 * @example
 * ```ts
 * const dropdown: StringDropdown = new StringDropdown()
 *     .setCustomId("pick_one")
 *     .setPlaceholder("Choose an option")
 *     .setMinValues(1)
 *     .setMaxValues(1)
 * ```
 */
abstract class BaseDropdown extends BaseComponent {
    /**
     * @summary Maximum length of `custom_id`.
     * @description Discord allows 1–100 characters for select menu identifiers.
     */
    private static readonly MAX_CUSTOM_ID_LENGTH: number = 100

    /**
     * @summary Maximum length of placeholder text.
     * @description Discord allows at most 150 characters when nothing is selected.
     */
    private static readonly MAX_PLACEHOLDER_LENGTH: number = 150

    /**
     * @summary Minimum allowed `min_values`.
     * @description Discord allows `0` when the select is not required.
     */
    private static readonly MIN_VALUES_FLOOR: number = 0

    /**
     * @summary Maximum number of selected items.
     * @description Discord caps both `min_values` and `max_values` at 25.
     */
    private static readonly MAX_VALUES_CEILING: number = 25

    /**
     * @summary Developer-defined select identifier.
     * @description Returned in the interaction payload when the user finishes choosing. Must be 1–100 characters.
     */
    private customId: string = ""

    /**
     * @summary Placeholder text.
     * @description Shown when nothing is selected. Maximum 150 characters.
     */
    private placeholder?: string

    /**
     * @summary Minimum number of items that must be chosen.
     * @description Discord defaults to `1` when omitted. Must be 0–25.
     */
    private minValues?: number

    /**
     * @summary Maximum number of items that can be chosen.
     * @description Discord defaults to `1` when omitted. Must be 1–25.
     */
    private maxValues?: number

    /**
     * @summary Whether an answer is required in a modal.
     * @description Only sent for modal selects. Discord defaults to `true` and ignores this field in messages.
     */
    private required?: boolean

    /**
     * @summary Disabled state.
     * @description Whether the select is non-interactive in a message. Discord defaults this to `false` when omitted. Invalid in modals.
     */
    private disabled?: boolean

    /**
     * @summary Gets the custom identifier.
     * @description Developer-defined `custom_id` sent back when the select is used.
     * @returns The custom identifier.
     */
    public getCustomId(): string {
        return this.customId
    }

    /**
     * @summary Sets the custom identifier.
     * @description Replaces `custom_id`. Must be 1–100 characters.
     * @param customId - Developer-defined identifier.
     * @returns This dropdown for chaining.
     */
    public setCustomId(customId: string): this {
        this.customId = BaseDropdown.assertCustomId(customId)
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
     * @description Shown when nothing is selected. Maximum 150 characters.
     * @param placeholder - Placeholder text.
     * @returns This dropdown for chaining.
     */
    public setPlaceholder(placeholder: string): this {
        this.placeholder = BaseDropdown.assertPlaceholder(placeholder)
        return this
    }

    /**
     * @summary Gets the minimum number of values.
     * @description Returns `min_values`, or `undefined` when Discord should use the default of `1`.
     * @returns The minimum number of items, or `undefined` if unset.
     */
    public getMinValues(): number | undefined {
        return this.minValues
    }

    /**
     * @summary Sets the minimum number of values.
     * @description Must be an integer from 0 to 25. If `required` is omitted or `true`, the value must be at least `1`.
     * @param minValues - Minimum number of items that must be chosen.
     * @returns This dropdown for chaining.
     */
    public setMinValues(minValues: number): this {
        this.minValues = BaseDropdown.assertMinValues(minValues)
        return this
    }

    /**
     * @summary Gets the maximum number of values.
     * @description Returns `max_values`, or `undefined` when Discord should use the default of `1`.
     * @returns The maximum number of items, or `undefined` if unset.
     */
    public getMaxValues(): number | undefined {
        return this.maxValues
    }

    /**
     * @summary Sets the maximum number of values.
     * @description Must be an integer from 1 to 25.
     * @param maxValues - Maximum number of items that can be chosen.
     * @returns This dropdown for chaining.
     */
    public setMaxValues(maxValues: number): this {
        this.maxValues = BaseDropdown.assertMaxValues(maxValues)
        return this
    }

    /**
     * @summary Gets whether the select is required in a modal.
     * @description Returns the required flag, or `undefined` when omitted from the payload.
     * @returns Whether the select is required, or `undefined` if unset.
     */
    public getRequired(): boolean | undefined {
        return this.required
    }

    /**
     * @summary Sets whether the select is required in a modal.
     * @description Modal-only. Discord defaults to `true` if omitted and ignores this field in messages.
     * @param required - Whether an answer is required.
     * @returns This dropdown for chaining.
     */
    public setRequired(required: boolean): this {
        this.required = required
        return this
    }

    /**
     * @summary Gets whether the select is disabled.
     * @description Returns the disabled flag, or `undefined` when the field should be omitted from the payload.
     * @returns Whether the select is disabled, or `undefined` if unset.
     */
    public getDisabled(): boolean | undefined {
        return this.disabled
    }

    /**
     * @summary Sets whether the select is disabled.
     * @description Marks the select as non-interactive in a message when `true`. Invalid in modals.
     * @param disabled - Whether the select is disabled.
     * @returns This dropdown for chaining.
     */
    public setDisabled(disabled: boolean): this {
        this.disabled = disabled
        return this
    }

    /**
     * @summary Shared fields present on every select payload.
     * @description Includes `type` and `custom_id`, plus optional `id`, placeholder, value limits, `required`, and `disabled` when set.
     * @returns Partial JSON fields common to all select types.
     */
    protected toBaseJSON(): Record<string, unknown> {
        const minValues: number | undefined = this.minValues
        const maxValues: number | undefined = this.maxValues
        if (minValues !== undefined && maxValues !== undefined && minValues > maxValues) {
            throw new RangeError("Select min_values cannot be greater than max_values.")
        }
        if (this.required !== false && minValues !== undefined && minValues < 1) {
            throw new RangeError("Select min_values must be at least 1 when required is omitted or true.")
        }

        const payload: Record<string, unknown> = {
            type: BaseDropdown.componentType,
            custom_id: BaseDropdown.assertCustomId(this.customId),
        }
        if (this.id !== undefined) payload.id = this.id
        if (this.placeholder !== undefined) payload.placeholder = this.placeholder
        if (minValues !== undefined) payload.min_values = minValues
        if (maxValues !== undefined) payload.max_values = maxValues
        if (this.required !== undefined) payload.required = this.required
        if (this.disabled !== undefined) payload.disabled = this.disabled
        return payload
    }

    /**
     * @summary Validates a custom identifier.
     * @description Ensures `custom_id` is a string of 1–100 characters.
     * @param customId - Candidate custom identifier.
     * @returns The validated custom identifier.
     */
    private static assertCustomId(customId: string): string {
        if (typeof customId !== "string") throw new TypeError("Select custom_id must be a string.")
        if (customId.length < 1 || customId.length > BaseDropdown.MAX_CUSTOM_ID_LENGTH) {
            throw new RangeError("Select custom_id must be between 1 and 100 characters.")
        }
        return customId
    }

    /**
     * @summary Validates placeholder text.
     * @description Ensures the placeholder is a string of at most 150 characters.
     * @param placeholder - Candidate placeholder.
     * @returns The validated placeholder.
     */
    private static assertPlaceholder(placeholder: string): string {
        if (typeof placeholder !== "string") throw new TypeError("Select placeholder must be a string.")
        if (placeholder.length > BaseDropdown.MAX_PLACEHOLDER_LENGTH) {
            throw new RangeError("Select placeholder must be at most 150 characters.")
        }
        return placeholder
    }

    /**
     * @summary Validates `min_values`.
     * @description Ensures the value is an integer from 0 to 25.
     * @param minValues - Candidate minimum.
     * @returns The validated minimum.
     */
    private static assertMinValues(minValues: number): number {
        if (
            !Number.isInteger(minValues) ||
            minValues < BaseDropdown.MIN_VALUES_FLOOR ||
            minValues > BaseDropdown.MAX_VALUES_CEILING
        ) {
            throw new RangeError("Select min_values must be an integer between 0 and 25.")
        }
        return minValues
    }

    /**
     * @summary Validates `max_values`.
     * @description Ensures the value is an integer from 1 to 25.
     * @param maxValues - Candidate maximum.
     * @returns The validated maximum.
     */
    private static assertMaxValues(maxValues: number): number {
        if (!Number.isInteger(maxValues) || maxValues < 1 || maxValues > BaseDropdown.MAX_VALUES_CEILING) {
            throw new RangeError("Select max_values must be an integer between 1 and 25.")
        }
        return maxValues
    }
}

export { BaseDropdown }
