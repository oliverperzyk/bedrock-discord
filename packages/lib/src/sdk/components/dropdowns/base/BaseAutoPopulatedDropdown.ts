import type { SelectDefaultValueType } from "../../../../models/sdk/components/dropdowns/enums/SelectDefaultValueType"
import type { ISelectDefaultValue } from "../../../../models/sdk/components/dropdowns/interfaces/ISelectDefaultValue"
import { BaseDropdown } from "./BaseDropdown"

/**
 * @summary Auto-populated Discord select menu.
 * @description Shared `default_values` for user, role, mentionable, and channel selects. Options come from the guild; string selects use explicit options instead.
 * @example
 * ```ts
 * const dropdown: RoleDropdown = new RoleDropdown()
 *     .setCustomId("roles")
 *     .setDefaultValues({ id: "123456789012345678" as Snowflake, type: SelectDefaultValueType.ROLE })
 * ```
 */
abstract class BaseAutoPopulatedDropdown extends BaseDropdown {
    /**
     * @summary Maximum number of default values.
     * @description Matches Discord's cap of 25 selected items on a select menu.
     */
    private static readonly MAX_DEFAULT_VALUES: number = 25

    /**
     * @summary Pre-selected entities.
     * @description Default users, roles, or channels shown when the menu opens. Count must fall within `min_values` and `max_values`.
     */
    private defaultValues?: ISelectDefaultValue[]

    /**
     * @summary Allowed default-value types for this select.
     * @description Subclasses restrict entries to user, role, and/or channel.
     * @returns Types this select may include in `default_values`.
     */
    protected abstract getAllowedDefaultValueTypes(): readonly SelectDefaultValueType[]

    /**
     * @summary Gets the default values.
     * @description Returns a copy of the default entities, or `undefined` when unset.
     * @returns The default values, or `undefined` if unset.
     */
    public getDefaultValues(): ISelectDefaultValue[] | undefined {
        return this.defaultValues === undefined ? undefined : this.defaultValues.slice()
    }

    /**
     * @summary Replaces the default values.
     * @description Overwrites `default_values`. Each entry must use a type allowed for this select.
     * @param defaultValues - Default entities to show as selected.
     * @returns This dropdown for chaining.
     */
    public setDefaultValues(...defaultValues: ISelectDefaultValue[]): this {
        this.defaultValues = this.assertDefaultValues(defaultValues)
        return this
    }

    /**
     * @summary Appends default values.
     * @description Adds entities to `default_values`, creating the list if it was unset.
     * @param defaultValues - Default entities to append.
     * @returns This dropdown for chaining.
     */
    public addDefaultValues(...defaultValues: ISelectDefaultValue[]): this {
        const current: ISelectDefaultValue[] = this.defaultValues ?? []
        this.defaultValues = this.assertDefaultValues(current.concat(defaultValues))
        return this
    }

    /**
     * @summary Shared fields for auto-populated selects.
     * @description Extends the common select payload with `default_values` when set.
     * @returns Partial JSON including default values when present.
     */
    protected override toBaseJSON(): Record<string, unknown> {
        const payload: Record<string, unknown> = super.toBaseJSON()
        if (this.defaultValues !== undefined) {
            payload.default_values = this.assertDefaultValues(this.defaultValues, true)
        }
        return payload
    }

    /**
     * @summary Validates default values.
     * @description Checks count, allowed types, and (on serialize) that the count sits within `min_values` and `max_values`.
     * @param defaultValues - Candidate default values.
     * @param enforceRange - When `true`, require the count to fall within min/max bounds.
     * @returns A copy of the validated list.
     */
    private assertDefaultValues(
        defaultValues: readonly ISelectDefaultValue[],
        enforceRange: boolean = false,
    ): ISelectDefaultValue[] {
        if (!Array.isArray(defaultValues)) throw new TypeError("Select default_values must be an array.")
        if (defaultValues.length > BaseAutoPopulatedDropdown.MAX_DEFAULT_VALUES) {
            throw new RangeError("Select default_values can contain at most 25 entries.")
        }
        const allowed: readonly SelectDefaultValueType[] = this.getAllowedDefaultValueTypes()
        for (const value of defaultValues) {
            if (value === null || typeof value !== "object") {
                throw new TypeError("Select default_values entries must be objects.")
            }
            if (typeof value.id !== "string" || value.id.length < 1) {
                throw new TypeError("Select default_values id must be a non-empty snowflake string.")
            }
            if (!allowed.includes(value.type)) {
                throw new TypeError("Select default_values type is not valid for this select.")
            }
        }
        if (enforceRange) {
            const minValues: number = this.getMinValues() ?? 1
            const maxValues: number = this.getMaxValues() ?? 1
            if (defaultValues.length < minValues || defaultValues.length > maxValues) {
                throw new RangeError("Select default_values count must be between min_values and max_values.")
            }
        }
        return defaultValues.slice()
    }
}

export { BaseAutoPopulatedDropdown }
