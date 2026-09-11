import { ComponentType } from "../../../models/sdk/components/base/enums/ComponentType"
import type { ActionRowComponents } from "../../../models/sdk/components/groups/action-row/types/ActionRowComponents"
import type { AnyActionRowComponent } from "../../../models/sdk/components/groups/action-row/types/AnyActionRowComponent"
import { BaseComponent } from "../base/BaseComponent"
import { BaseButton } from "../buttons/base/BaseButton"

/**
 * @summary Discord action row to group interactive components.
 * @description Top-level layout container for a row of interactive components. The generic is the child builder type, matching discord.js `ActionRowBuilder<T>`. Holds up to five contextually grouped buttons, or a single select menu. Action rows that wrap text inputs in modals are deprecated; use a Label instead.
 * @typeParam TComponent - The component builders this row holds.
 * @example
 * ```ts
 * const row: ActionRow<InteractiveButton> = new ActionRow<InteractiveButton>()
 *     .addComponents(
 *         new InteractiveButton().setCustomId("yes").setLabel("Yes"),
 *         new InteractiveButton().setCustomId("no").setLabel("No").setStyle(ButtonStyle.SECONDARY),
 *     )
 * ```
 */
class ActionRow<TComponent extends AnyActionRowComponent = BaseButton> extends BaseComponent {
    /**
     * @summary The type of the component.
     * @description Always `ComponentType.ACTION_ROW` for action row payloads sent to Discord.
     */
    protected static override readonly componentType: ComponentType = ComponentType.ACTION_ROW

    /**
     * @summary Maximum number of child components.
     * @description Discord allows at most five buttons in one action row. A select or text input must be the only child.
     */
    private static readonly MAX_COMPONENTS: number = 5

    /**
     * @summary Child components in this row.
     * @description Children grouped in this action row. A row may contain up to five buttons, or a single select or text input.
     */
    private components: TComponent[] = []

    /**
     * @summary Creates an action row.
     * @description Starts with no children. Add supported components with {@link ActionRow.addComponents} or {@link ActionRow.setComponents} before sending.
     */
    public constructor() {
        super()
    }

    /**
     * @summary Gets the child components.
     * @description Returns a copy of the components currently in this row.
     * @returns The child components in insertion order.
     */
    public getComponents(): TComponent[] {
        return this.components.slice()
    }

    /**
     * @summary Appends child components.
     * @description Adds children of type {@link TComponent} to the end of the row. Use up to five buttons, or a single select. Text inputs in action rows are deprecated.
     * @param components - Components to append.
     * @returns This action row for chaining.
     */
    public addComponents(...components: ActionRowComponents<TComponent>): this {
        const next: TComponent[] = this.components.concat(components)
        this.components = ActionRow.assertComponents<TComponent>(next)
        return this
    }

    /**
     * @summary Replaces all child components.
     * @description Overwrites the row contents with builders of type {@link TComponent}. Pass up to five buttons, or a single select. Text inputs in action rows are deprecated.
     * @param components - Components that become the full contents of the row.
     * @returns This action row for chaining.
     */
    public setComponents(...components: ActionRowComponents<TComponent>): this {
        this.components = ActionRow.assertComponents<TComponent>(components)
        return this
    }

    /**
     * @summary Converts the action row to a JSON object.
     * @description Builds a Discord action row payload with `type` `1` and serialized child components.
     * @returns The JSON object representation of the action row.
     */
    public toJSON(): Record<string, unknown> {
        const children: TComponent[] = ActionRow.assertComponents<TComponent>(this.components, true)
        const payload: Record<string, unknown> = {
            type: (this.constructor as typeof ActionRow).componentType,
            components: children.map((component: TComponent) => component.toJSON()),
        }
        if (this.id !== undefined) payload.id = this.id
        return payload
    }

    /**
     * @summary Validates action row children.
     * @description Ensures children are a homogeneous group: up to five buttons, or a single select or text input.
     * @param components - Candidate child components.
     * @param requireNonEmpty - When `true`, rejects an empty row (used when serializing).
     * @returns The validated child list.
     */
    private static assertComponents<TComponent extends AnyActionRowComponent>(
        components: readonly TComponent[],
        requireNonEmpty: boolean = false,
    ): TComponent[] {
        if (!Array.isArray(components)) throw new TypeError("Action row components must be an array.")
        if (requireNonEmpty && components.length < 1) {
            throw new RangeError("Action row must contain at least one component.")
        }
        if (components.length > ActionRow.MAX_COMPONENTS) {
            throw new RangeError("Action row can contain at most 5 components.")
        }
        for (const component of components) {
            if (!(component instanceof BaseComponent)) {
                throw new TypeError("Action row children must be components.")
            }
        }
        return components.slice()
    }
}

export { ActionRow }
