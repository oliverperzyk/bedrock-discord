import { ComponentType } from "../../../../models/sdk/components/base/enums/ComponentType"
import { BaseComponent } from "../../base/BaseComponent"
import { CheckboxGroupElement } from "./CheckboxGroupElement"

/**
 * @summary Discord checkbox group for one or many modal choices.
 * @description Interactive component for selecting multiple options. Available in modals and must be placed inside a Label. Holds 1–10 {@link CheckboxGroupElement} options.
 * @example
 * ```ts
 * const group: CheckboxGroup = new CheckboxGroup()
 *     .setCustomId("event_checkbox")
 *     .addElements(
 *         new CheckboxGroupElement().setValue("march-4").setLabel("March 4th"),
 *         new CheckboxGroupElement().setValue("march-5").setLabel("March 5th"),
 *     )
 * ```
 */
class CheckboxGroup extends BaseComponent {
    /**
     * @summary The type of the component.
     * @description Always `ComponentType.CHECKBOX_GROUP` for checkbox group payloads sent to Discord.
     */
    protected static override readonly componentType: ComponentType = ComponentType.CHECKBOX_GROUP

    /**
     * @summary Maximum length of `custom_id`.
     * @description Discord allows 1–100 characters for checkbox group identifiers.
     */
    private static readonly MAX_CUSTOM_ID_LENGTH: number = 100

    /**
     * @summary Maximum number of options and selected values.
     * @description Discord caps options, `min_values`, and `max_values` at 10.
     */
    private static readonly MAX_ELEMENTS: number = 10

    /**
     * @summary Developer-defined group identifier.
     * @description Returned in the interaction payload when the modal is submitted. Must be 1–100 characters.
     */
    private customId: string = ""

    /**
     * @summary Options in this group.
     * @description Checkbox choices shown to the user. At least one and at most 10 when serializing.
     */
    private elements: CheckboxGroupElement[] = []

    /**
     * @summary Minimum number of items that must be chosen.
     * @description Discord defaults to `1` when omitted. Must be 0–10. When `required` is omitted or `true`, must be at least `1`.
     */
    private minValues?: number

    /**
     * @summary Maximum number of items that can be chosen.
     * @description Discord defaults to the number of options when omitted. Must be 1–10.
     */
    private maxValues?: number

    /**
     * @summary Whether a selection is required.
     * @description Discord defaults this to `true` when omitted.
     */
    private required?: boolean

    /**
     * @summary Creates a checkbox group.
     * @description Starts with no `custom_id` or options. Set an identifier and add at least one {@link CheckboxGroupElement} before sending.
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
     * @returns This checkbox group for chaining.
     */
    public setCustomId(customId: string): this {
        this.customId = CheckboxGroup.assertCustomId(customId)
        return this
    }

    /**
     * @summary Gets the checkbox options.
     * @description Returns a copy of the {@link CheckboxGroupElement} builders currently in this group.
     * @returns The options in insertion order.
     */
    public getElements(): CheckboxGroupElement[] {
        return this.elements.slice()
    }

    /**
     * @summary Appends checkbox options.
     * @description Adds {@link CheckboxGroupElement} builders to the end of the group. Combined length cannot exceed 10.
     * @param elements - Options to append.
     * @returns This checkbox group for chaining.
     */
    public addElements(...elements: CheckboxGroupElement[]): this {
        this.elements = CheckboxGroup.assertElements(this.elements.concat(elements))
        return this
    }

    /**
     * @summary Replaces all checkbox options.
     * @description Overwrites the option list. Pass 1–10 elements before serializing.
     * @param elements - Options that become the full list.
     * @returns This checkbox group for chaining.
     */
    public setElements(...elements: CheckboxGroupElement[]): this {
        this.elements = CheckboxGroup.assertElements(elements)
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
     * @description Must be an integer from 0 to 10. If `required` is omitted or `true`, the value must be at least `1`.
     * @param minValues - Minimum number of items that must be chosen.
     * @returns This checkbox group for chaining.
     */
    public setMinValues(minValues: number): this {
        this.minValues = CheckboxGroup.assertMinValues(minValues)
        return this
    }

    /**
     * @summary Gets the maximum number of values.
     * @description Returns `max_values`, or `undefined` when Discord should default to the option count.
     * @returns The maximum number of items, or `undefined` if unset.
     */
    public getMaxValues(): number | undefined {
        return this.maxValues
    }

    /**
     * @summary Sets the maximum number of values.
     * @description Must be an integer from 1 to 10.
     * @param maxValues - Maximum number of items that can be chosen.
     * @returns This checkbox group for chaining.
     */
    public setMaxValues(maxValues: number): this {
        this.maxValues = CheckboxGroup.assertMaxValues(maxValues)
        return this
    }

    /**
     * @summary Gets whether a selection is required.
     * @description Returns the required flag, or `undefined` when omitted from the payload.
     * @returns Whether a selection is required, or `undefined` if unset.
     */
    public getRequired(): boolean | undefined {
        return this.required
    }

    /**
     * @summary Sets whether a selection is required.
     * @description Discord defaults to `true` when this field is omitted.
     * @param required - Whether the user must pick at least the minimum number of options.
     * @returns This checkbox group for chaining.
     */
    public setRequired(required: boolean): this {
        this.required = required
        return this
    }

    /**
     * @summary Converts the checkbox group to a JSON object.
     * @description Builds a Discord checkbox group payload with `type` `22`, required `custom_id` and `options`, and optional value limits and `required`.
     * @returns The JSON object representation of the checkbox group.
     */
    public toJSON(): Record<string, unknown> {
        const elements: CheckboxGroupElement[] = CheckboxGroup.assertElements(this.elements, true)
        const minValues: number | undefined = this.minValues
        const maxValues: number | undefined = this.maxValues
        if (minValues !== undefined && minValues > elements.length) {
            throw new RangeError("Checkbox group min_values cannot be greater than the number of options.")
        }
        if (maxValues !== undefined && maxValues > elements.length) {
            throw new RangeError("Checkbox group max_values cannot be greater than the number of options.")
        }
        if (minValues !== undefined && maxValues !== undefined && minValues > maxValues) {
            throw new RangeError("Checkbox group min_values cannot be greater than max_values.")
        }
        if (this.required !== false && minValues !== undefined && minValues < 1) {
            throw new RangeError("Checkbox group min_values must be at least 1 when required is omitted or true.")
        }

        const payload: Record<string, unknown> = {
            type: CheckboxGroup.componentType,
            custom_id: CheckboxGroup.assertCustomId(this.customId),
            options: elements.map((element: CheckboxGroupElement) => element.toJSON()),
        }
        if (this.id !== undefined) payload.id = this.id
        if (minValues !== undefined) payload.min_values = minValues
        if (maxValues !== undefined) payload.max_values = maxValues
        if (this.required !== undefined) payload.required = this.required
        return payload
    }

    /**
     * @summary Validates a custom identifier.
     * @description Ensures `custom_id` is a string of 1–100 characters.
     * @param customId - Candidate custom identifier.
     * @returns The validated custom identifier.
     */
    private static assertCustomId(customId: string): string {
        if (typeof customId !== "string") throw new TypeError("Checkbox group custom_id must be a string.")
        if (customId.length < 1 || customId.length > CheckboxGroup.MAX_CUSTOM_ID_LENGTH) {
            throw new RangeError("Checkbox group custom_id must be between 1 and 100 characters.")
        }
        return customId
    }

    /**
     * @summary Validates `min_values`.
     * @description Ensures the value is an integer from 0 to 10.
     * @param minValues - Candidate minimum.
     * @returns The validated minimum.
     */
    private static assertMinValues(minValues: number): number {
        if (!Number.isInteger(minValues) || minValues < 0 || minValues > CheckboxGroup.MAX_ELEMENTS) {
            throw new RangeError("Checkbox group min_values must be an integer between 0 and 10.")
        }
        return minValues
    }

    /**
     * @summary Validates `max_values`.
     * @description Ensures the value is an integer from 1 to 10.
     * @param maxValues - Candidate maximum.
     * @returns The validated maximum.
     */
    private static assertMaxValues(maxValues: number): number {
        if (!Number.isInteger(maxValues) || maxValues < 1 || maxValues > CheckboxGroup.MAX_ELEMENTS) {
            throw new RangeError("Checkbox group max_values must be an integer between 1 and 10.")
        }
        return maxValues
    }

    /**
     * @summary Validates checkbox options.
     * @description Ensures children are {@link CheckboxGroupElement} builders, the list stays within 1–10, and values are unique.
     * @param elements - Candidate options.
     * @param requireNonEmpty - When `true`, rejects an empty group (used when serializing).
     * @returns The validated option list.
     */
    private static assertElements(
        elements: readonly CheckboxGroupElement[],
        requireNonEmpty: boolean = false,
    ): CheckboxGroupElement[] {
        if (!Array.isArray(elements)) throw new TypeError("Checkbox group options must be an array.")
        if (requireNonEmpty && elements.length < 1) {
            throw new RangeError("Checkbox group must contain at least 1 option.")
        }
        if (elements.length > CheckboxGroup.MAX_ELEMENTS) {
            throw new RangeError("Checkbox group can contain at most 10 options.")
        }

        const values: Set<string> = new Set()
        for (const element of elements) {
            if (!(element instanceof CheckboxGroupElement)) {
                throw new TypeError("Checkbox group options must be CheckboxGroupElement builders.")
            }
            const value: string | undefined = element.getValue()
            if (value !== undefined) {
                if (values.has(value)) {
                    throw new RangeError("Checkbox group option values must be unique.")
                }
                values.add(value)
            }
        }
        return elements.slice()
    }
}

export { CheckboxGroup }
