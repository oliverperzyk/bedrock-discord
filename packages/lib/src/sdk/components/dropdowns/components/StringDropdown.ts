import { ComponentType } from "../../../../models/sdk/components/base/enums/ComponentType"
import type { ISelectOption } from "../../../../models/sdk/components/dropdowns/interfaces/ISelectOption"
import { BaseDropdown } from "../base/BaseDropdown"

/**
 * @summary String select menu.
 * @description Interactive select with developer-defined text options. Place in an Action Row on messages or a Label on modals.
 * @example
 * ```ts
 * const dropdown: StringDropdown = new StringDropdown()
 *     .setCustomId("color")
 *     .setPlaceholder("Pick a color")
 *     .addOptions(
 *         { label: "Red", value: "red" },
 *         { label: "Blue", value: "blue" },
 *     )
 * ```
 */
class StringDropdown extends BaseDropdown {
    /**
     * @summary The type of the component.
     * @description Always `ComponentType.STRING_SELECT_MENU` for string select payloads sent to Discord.
     */
    protected static override readonly componentType: ComponentType = ComponentType.STRING_SELECT_MENU

    /**
     * @summary Maximum number of options.
     * @description Discord allows at most 25 choices on a string select.
     */
    private static readonly MAX_OPTIONS: number = 25

    /**
     * @summary Maximum length of option label, value, and description.
     * @description Discord caps each of these strings at 100 characters.
     */
    private static readonly MAX_OPTION_TEXT_LENGTH: number = 100

    /**
     * @summary Select options.
     * @description Specified choices shown in the menu. At least one and at most 25 when serializing.
     */
    private options: ISelectOption[] = []

    /**
     * @summary Creates a string select.
     * @description Starts with no options. Add choices with {@link StringDropdown.addOptions} or {@link StringDropdown.setOptions} before sending.
     */
    public constructor() {
        super()
    }

    /**
     * @summary Gets the select options.
     * @description Returns a copy of the current choices.
     * @returns The options in insertion order.
     */
    public getOptions(): ISelectOption[] {
        return this.options.slice()
    }

    /**
     * @summary Appends select options.
     * @description Adds choices to the end of the list. Combined length cannot exceed 25.
     * @param options - Options to append.
     * @returns This dropdown for chaining.
     */
    public addOptions(...options: ISelectOption[]): this {
        this.options = StringDropdown.assertOptions(this.options.concat(options))
        return this
    }

    /**
     * @summary Replaces all select options.
     * @description Overwrites the choice list. Pass 1–25 options before serializing.
     * @param options - Options that become the full choice list.
     * @returns This dropdown for chaining.
     */
    public setOptions(...options: ISelectOption[]): this {
        this.options = StringDropdown.assertOptions(options)
        return this
    }

    /**
     * @summary Converts the select to a JSON object.
     * @description Builds a Discord string select payload with `type` `3`, `custom_id`, and `options`.
     * @returns The JSON object representation of the select.
     */
    public toJSON(): Record<string, unknown> {
        return {
            ...this.toBaseJSON(),
            options: StringDropdown.assertOptions(this.options, true),
        }
    }

    /**
     * @summary Validates string select options.
     * @description Ensures each option has a label and value of at most 100 characters, and the list is at most 25 long.
     * @param options - Candidate options.
     * @param requireNonEmpty - When `true`, rejects an empty list (used when serializing).
     * @returns A copy of the validated options.
     */
    private static assertOptions(options: readonly ISelectOption[], requireNonEmpty: boolean = false): ISelectOption[] {
        if (!Array.isArray(options)) throw new TypeError("String select options must be an array.")
        if (requireNonEmpty && options.length < 1) {
            throw new RangeError("String select must contain at least one option.")
        }
        if (options.length > StringDropdown.MAX_OPTIONS) {
            throw new RangeError("String select can contain at most 25 options.")
        }
        for (const option of options) {
            if (option === null || typeof option !== "object") {
                throw new TypeError("String select options must be objects.")
            }
            StringDropdown.assertOptionText("label", option.label)
            StringDropdown.assertOptionText("value", option.value)
            if (option.description !== undefined) {
                StringDropdown.assertOptionText("description", option.description)
            }
        }
        return options.slice()
    }

    /**
     * @summary Validates an option string field.
     * @description Ensures the field is a non-empty string of at most 100 characters.
     * @param field - Field name for error messages.
     * @param value - Candidate string.
     */
    private static assertOptionText(field: string, value: string): void {
        if (typeof value !== "string") throw new TypeError(`String select option ${field} must be a string.`)
        if (value.length < 1 || value.length > StringDropdown.MAX_OPTION_TEXT_LENGTH) {
            throw new RangeError(`String select option ${field} must be between 1 and 100 characters.`)
        }
    }
}

export { StringDropdown }
