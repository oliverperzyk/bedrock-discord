import { ComponentType } from "../../../../models/sdk/components/base/enums/ComponentType"
import { SelectDefaultValueType } from "../../../../models/sdk/components/dropdowns/enums/SelectDefaultValueType"
import { BaseAutoPopulatedDropdown } from "../base/BaseAutoPopulatedDropdown"

/**
 * @summary Mentionable select menu.
 * @description Interactive select populated with users and roles from the server. Place in an Action Row on messages or a Label on modals.
 * @example
 * ```ts
 * const dropdown: MentionableDropdown = new MentionableDropdown()
 *     .setCustomId("mention")
 *     .setPlaceholder("Pick a member or role")
 * ```
 */
class MentionableDropdown extends BaseAutoPopulatedDropdown {
    /**
     * @summary The type of the component.
     * @description Always `ComponentType.MENTIONABLE_SELECT_MENU` for mentionable select payloads sent to Discord.
     */
    protected static override readonly componentType: ComponentType = ComponentType.MENTIONABLE_SELECT_MENU

    /**
     * @summary Creates a mentionable select.
     * @description Starts with no default values. Set `custom_id` before sending.
     */
    public constructor() {
        super()
    }

    /**
     * @summary Allowed default-value types.
     * @description Mentionable selects may default to users or roles.
     * @returns `SelectDefaultValueType.USER` and `SelectDefaultValueType.ROLE`.
     */
    protected override getAllowedDefaultValueTypes(): readonly SelectDefaultValueType[] {
        return [SelectDefaultValueType.USER, SelectDefaultValueType.ROLE]
    }

    /**
     * @summary Converts the select to a JSON object.
     * @description Builds a Discord mentionable select payload with `type` `7` and shared select fields.
     * @returns The JSON object representation of the select.
     */
    public toJSON(): Record<string, unknown> {
        return this.toBaseJSON()
    }
}

export { MentionableDropdown }
