import { ComponentType } from "../../../../models/sdk/components/base/enums/ComponentType"
import { SelectDefaultValueType } from "../../../../models/sdk/components/dropdowns/enums/SelectDefaultValueType"
import { BaseAutoPopulatedDropdown } from "../base/BaseAutoPopulatedDropdown"

/**
 * @summary User select menu.
 * @description Interactive select populated with users from the server. Place in an Action Row on messages or a Label on modals.
 * @example
 * ```ts
 * const dropdown: UserDropdown = new UserDropdown()
 *     .setCustomId("assignee")
 *     .setPlaceholder("Pick a user")
 *     .setMaxValues(3)
 * ```
 */
class UserDropdown extends BaseAutoPopulatedDropdown {
    /**
     * @summary The type of the component.
     * @description Always `ComponentType.USER_SELECT_MENU` for user select payloads sent to Discord.
     */
    protected static override readonly componentType: ComponentType = ComponentType.USER_SELECT_MENU

    /**
     * @summary Creates a user select.
     * @description Starts with no default values. Set `custom_id` before sending.
     */
    public constructor() {
        super()
    }

    /**
     * @summary Allowed default-value types.
     * @description User selects may only default to users.
     * @returns `SelectDefaultValueType.USER` only.
     */
    protected override getAllowedDefaultValueTypes(): readonly SelectDefaultValueType[] {
        return [SelectDefaultValueType.USER]
    }

    /**
     * @summary Converts the select to a JSON object.
     * @description Builds a Discord user select payload with `type` `5` and shared select fields.
     * @returns The JSON object representation of the select.
     */
    public toJSON(): Record<string, unknown> {
        return this.toBaseJSON()
    }
}

export { UserDropdown }
