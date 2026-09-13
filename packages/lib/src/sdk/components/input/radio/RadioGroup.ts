import { ComponentType } from "../../../../models/sdk/components/base/enums/ComponentType"
import { BaseComponent } from "../../base/BaseComponent"
import { RadioGroupElement } from "./RadioGroupElement"

/**
 * @summary Discord radio group for a single modal choice.
 * @description Interactive component for selecting exactly one option. Available in modals and must be placed inside a Label. Holds 2–10 {@link RadioGroupElement} options.
 * @example
 * ```ts
 * const group: RadioGroup = new RadioGroup()
 *     .setCustomId("class_radio")
 *     .addElements(
 *         new RadioGroupElement()
 *             .setValue("warrior")
 *             .setLabel("Warrior")
 *             .setDescription("Strong and brave"),
 *         new RadioGroupElement()
 *             .setValue("rogue")
 *             .setLabel("Rogue")
 *             .setDescription("Weak and squishy"),
 *     )
 * ```
 */
class RadioGroup extends BaseComponent {
    /**
     * @summary The type of the component.
     * @description Always `ComponentType.RADIO_GROUP` for radio group payloads sent to Discord.
     */
    protected static override readonly componentType: ComponentType = ComponentType.RADIO_GROUP

    /**
     * @summary Maximum length of `custom_id`.
     * @description Discord allows 1–100 characters for radio group identifiers.
     */
    private static readonly MAX_CUSTOM_ID_LENGTH: number = 100

    /**
     * @summary Minimum number of options.
     * @description Discord requires at least two radio options.
     */
    private static readonly MIN_ELEMENTS: number = 2

    /**
     * @summary Maximum number of options.
     * @description Discord allows at most 10 radio options.
     */
    private static readonly MAX_ELEMENTS: number = 10

    /**
     * @summary Developer-defined group identifier.
     * @description Returned in the interaction payload when the modal is submitted. Must be 1–100 characters.
     */
    private customId: string = ""

    /**
     * @summary Options in this group.
     * @description Radio choices shown to the user. At least two and at most 10 when serializing.
     */
    private elements: RadioGroupElement[] = []

    /**
     * @summary Whether a selection is required.
     * @description Discord defaults this to `true` when omitted.
     */
    private required?: boolean

    /**
     * @summary Creates a radio group.
     * @description Starts with no `custom_id` or options. Set an identifier and add at least two {@link RadioGroupElement} builders before sending.
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
     * @returns This radio group for chaining.
     */
    public setCustomId(customId: string): this {
        this.customId = RadioGroup.assertCustomId(customId)
        return this
    }

    /**
     * @summary Gets the radio options.
     * @description Returns a copy of the {@link RadioGroupElement} builders currently in this group.
     * @returns The options in insertion order.
     */
    public getElements(): RadioGroupElement[] {
        return this.elements.slice()
    }

    /**
     * @summary Appends radio options.
     * @description Adds {@link RadioGroupElement} builders to the end of the group. Combined length cannot exceed 10.
     * @param elements - Options to append.
     * @returns This radio group for chaining.
     */
    public addElements(...elements: RadioGroupElement[]): this {
        this.elements = RadioGroup.assertElements(this.elements.concat(elements))
        return this
    }

    /**
     * @summary Replaces all radio options.
     * @description Overwrites the option list. Pass 2–10 elements before serializing.
     * @param elements - Options that become the full list.
     * @returns This radio group for chaining.
     */
    public setElements(...elements: RadioGroupElement[]): this {
        this.elements = RadioGroup.assertElements(elements)
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
     * @param required - Whether the user must pick an option.
     * @returns This radio group for chaining.
     */
    public setRequired(required: boolean): this {
        this.required = required
        return this
    }

    /**
     * @summary Converts the radio group to a JSON object.
     * @description Builds a Discord radio group payload with `type` `21`, required `custom_id` and `options`, and optional `required`.
     * @returns The JSON object representation of the radio group.
     */
    public toJSON(): Record<string, unknown> {
        const elements: RadioGroupElement[] = RadioGroup.assertElements(this.elements, true)
        const payload: Record<string, unknown> = {
            type: RadioGroup.componentType,
            custom_id: RadioGroup.assertCustomId(this.customId),
            options: elements.map((element: RadioGroupElement) => element.toJSON()),
        }
        if (this.id !== undefined) payload.id = this.id
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
        if (typeof customId !== "string") throw new TypeError("Radio group custom_id must be a string.")
        if (customId.length < 1 || customId.length > RadioGroup.MAX_CUSTOM_ID_LENGTH) {
            throw new RangeError("Radio group custom_id must be between 1 and 100 characters.")
        }
        return customId
    }

    /**
     * @summary Validates radio options.
     * @description Ensures children are {@link RadioGroupElement} builders, the list stays within 2–10, values are unique, and at most one option is default.
     * @param elements - Candidate options.
     * @param requireNonEmpty - When `true`, rejects fewer than two options (used when serializing).
     * @returns The validated option list.
     */
    private static assertElements(
        elements: readonly RadioGroupElement[],
        requireNonEmpty: boolean = false,
    ): RadioGroupElement[] {
        if (!Array.isArray(elements)) throw new TypeError("Radio group options must be an array.")
        if (requireNonEmpty && elements.length < RadioGroup.MIN_ELEMENTS) {
            throw new RangeError("Radio group must contain at least 2 options.")
        }
        if (elements.length > RadioGroup.MAX_ELEMENTS) {
            throw new RangeError("Radio group can contain at most 10 options.")
        }

        const values: Set<string> = new Set()
        let defaultCount: number = 0
        for (const element of elements) {
            if (!(element instanceof RadioGroupElement)) {
                throw new TypeError("Radio group options must be RadioGroupElement builders.")
            }
            if (element.getDefault() === true) defaultCount += 1
            const value: string | undefined = element.getValue()
            if (value !== undefined) {
                if (values.has(value)) {
                    throw new RangeError("Radio group option values must be unique.")
                }
                values.add(value)
            }
        }
        if (defaultCount > 1) {
            throw new RangeError("Radio group can contain at most one default option.")
        }
        return elements.slice()
    }
}

export { RadioGroup }
