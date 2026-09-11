import { ComponentType } from "../../../../models/sdk/components/base/enums/ComponentType"
import { SelectDefaultValueType } from "../../../../models/sdk/components/dropdowns/enums/SelectDefaultValueType"
import { BaseAutoPopulatedDropdown } from "../base/BaseAutoPopulatedDropdown"

/**
 * @summary Role select menu.
 * @description Interactive select populated with roles from the server. Place in an Action Row on messages or a Label on modals.
 * @example
 * ```ts
 * const dropdown: RoleDropdown = new RoleDropdown()
 *     .setCustomId("roles")
 *     .setPlaceholder("Pick a role")
 *     .setMinValues(1)
 *     .setMaxValues(5)
 * ```
 */
class RoleDropdown extends BaseAutoPopulatedDropdown {
    /**
     * @summary The type of the component.
     * @description Always `ComponentType.ROLE_SELECT_MENU` for role select payloads sent to Discord.
     */
    protected static override readonly componentType: ComponentType = ComponentType.ROLE_SELECT_MENU

    /**
     * @summary Creates a role select.
     * @description Starts with no default values. Set `custom_id` before sending.
     */
    public constructor() {
        super()
    }

    /**
     * @summary Allowed default-value types.
     * @description Role selects may only default to roles.
     * @returns `SelectDefaultValueType.ROLE` only.
     */
    protected override getAllowedDefaultValueTypes(): readonly SelectDefaultValueType[] {
        return [SelectDefaultValueType.ROLE]
    }

    /**
     * @summary Converts the select to a JSON object.
     * @description Builds a Discord role select payload with `type` `6` and shared select fields.
     * @returns The JSON object representation of the select.
     */
    public toJSON(): Record<string, unknown> {
        return this.toBaseJSON()
    }
}

export { RoleDropdown }
