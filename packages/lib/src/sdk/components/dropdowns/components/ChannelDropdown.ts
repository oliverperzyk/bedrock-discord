import { ChannelType } from "../../../../models/sdk/channels/base/enums/ChannelType"
import { ComponentType } from "../../../../models/sdk/components/base/enums/ComponentType"
import { SelectDefaultValueType } from "../../../../models/sdk/components/dropdowns/enums/SelectDefaultValueType"
import { BaseAutoPopulatedDropdown } from "../base/BaseAutoPopulatedDropdown"

/**
 * @summary Channel select menu.
 * @description Interactive select populated with channels from the server, optionally filtered by type. Place in an Action Row on messages or a Label on modals.
 * @example
 * ```ts
 * const dropdown: ChannelDropdown = new ChannelDropdown()
 *     .setCustomId("channel")
 *     .setPlaceholder("Pick a channel")
 *     .setChannelTypes(ChannelType.GUILD_TEXT, ChannelType.GUILD_ANNOUNCEMENT)
 * ```
 */
class ChannelDropdown extends BaseAutoPopulatedDropdown {
    /**
     * @summary The type of the component.
     * @description Always `ComponentType.CHANNEL_SELECT_MENU` for channel select payloads sent to Discord.
     */
    protected static override readonly componentType: ComponentType = ComponentType.CHANNEL_SELECT_MENU

    /**
     * @summary Channel type filter.
     * @description When set, only these channel kinds appear in the menu.
     */
    private channelTypes?: ChannelType[]

    /**
     * @summary Creates a channel select.
     * @description Starts with no type filter or default values. Set `custom_id` before sending.
     */
    public constructor() {
        super()
    }

    /**
     * @summary Allowed default-value types.
     * @description Channel selects may only default to channels.
     * @returns `SelectDefaultValueType.CHANNEL` only.
     */
    protected override getAllowedDefaultValueTypes(): readonly SelectDefaultValueType[] {
        return [SelectDefaultValueType.CHANNEL]
    }

    /**
     * @summary Gets the channel type filter.
     * @description Returns a copy of included channel types, or `undefined` when unset.
     * @returns The channel types, or `undefined` if unset.
     */
    public getChannelTypes(): ChannelType[] | undefined {
        return this.channelTypes === undefined ? undefined : this.channelTypes.slice()
    }

    /**
     * @summary Sets the channel type filter.
     * @description Restricts the menu to the given Discord channel types.
     * @param channelTypes - Channel types to include.
     * @returns This dropdown for chaining.
     */
    public setChannelTypes(...channelTypes: ChannelType[]): this {
        this.channelTypes = ChannelDropdown.assertChannelTypes(channelTypes)
        return this
    }

    /**
     * @summary Converts the select to a JSON object.
     * @description Builds a Discord channel select payload with `type` `8` and optional `channel_types`.
     * @returns The JSON object representation of the select.
     */
    public toJSON(): Record<string, unknown> {
        const payload: Record<string, unknown> = this.toBaseJSON()
        if (this.channelTypes !== undefined) payload.channel_types = this.channelTypes.slice()
        return payload
    }

    /**
     * @summary Validates channel types.
     * @description Ensures each value is a known {@link ChannelType}.
     * @param channelTypes - Candidate channel types.
     * @returns A copy of the validated list.
     */
    private static assertChannelTypes(channelTypes: readonly ChannelType[]): ChannelType[] {
        if (!Array.isArray(channelTypes)) throw new TypeError("Channel select channel_types must be an array.")
        const allowed: number[] = Object.values(ChannelType).filter(
            (value: string | ChannelType): value is ChannelType => typeof value === "number",
        )
        for (const channelType of channelTypes) {
            if (!allowed.includes(channelType)) {
                throw new TypeError("Channel select channel_types must be valid ChannelType values.")
            }
        }
        return channelTypes.slice()
    }
}

export { ChannelDropdown }
