import { ComponentType } from "../../../models/sdk/components/base/enums/ComponentType"
import type { AnyContainerComponent } from "../../../models/sdk/components/layout/container/types/AnyContainerComponent"
import { BaseComponent } from "../base/BaseComponent"
import { ActionRow } from "./ActionRow"

/**
 * @summary Discord container to visually group components.
 * @description Top-level layout component for messages. Encapsulates child components with an optional accent color bar and spoiler. Requires the `IS_COMPONENTS_V2` message flag (`1 << 15`). The generic is the child builder type, matching discord.js `ContainerBuilder`.
 * @typeParam TComponent - The component builders this container holds.
 * @example
 * ```ts
 * const container: Container = new Container()
 *     .setAccentColor(0x0abb7f)
 *     .addComponents(
 *         new ActionRow().addComponents(
 *             new InteractiveButton().setCustomId("pet_coyote").setLabel("Pet it!"),
 *         ),
 *     )
 * ```
 */
class Container<TComponent extends AnyContainerComponent = ActionRow> extends BaseComponent {
    /**
     * @summary The type of the component.
     * @description Always `ComponentType.CONTAINER` for container payloads sent to Discord.
     */
    protected static override readonly componentType: ComponentType = ComponentType.CONTAINER

    /**
     * @summary Maximum RGB accent color.
     * @description Discord allows `accent_color` from `0x000000` to `0xFFFFFF`.
     */
    private static readonly MAX_ACCENT_COLOR: number = 0xffffff

    /**
     * @summary Child components in this container.
     * @description Encapsulated layout and content components. Currently action rows; other v2 children will be accepted as they land.
     */
    private components: TComponent[] = []

    /**
     * @summary Accent color of the container.
     * @description RGB integer from `0x000000` to `0xFFFFFF`, or `null` to send an empty accent. Omitted from the payload when unset.
     */
    private accentColor?: number | null

    /**
     * @summary Spoiler state.
     * @description Whether the container is blurred until revealed. Discord defaults this to `false` when omitted.
     */
    private spoiler?: boolean

    /**
     * @summary Creates a container.
     * @description Starts with no children, accent color, or spoiler. Add supported components with {@link Container.addComponents} or {@link Container.setComponents} before sending.
     */
    public constructor() {
        super()
    }

    /**
     * @summary Gets the child components.
     * @description Returns a copy of the components currently in this container.
     * @returns The child components in insertion order.
     */
    public getComponents(): TComponent[] {
        return this.components.slice()
    }

    /**
     * @summary Appends child components.
     * @description Adds children of type {@link TComponent} to the end of the container.
     * @param components - Components to append.
     * @returns This container for chaining.
     */
    public addComponents(...components: TComponent[]): this {
        const next: TComponent[] = this.components.concat(components)
        this.components = Container.assertComponents<TComponent>(next)
        return this
    }

    /**
     * @summary Replaces all child components.
     * @description Overwrites the container contents with builders of type {@link TComponent}.
     * @param components - Components that become the full contents of the container.
     * @returns This container for chaining.
     */
    public setComponents(...components: TComponent[]): this {
        this.components = Container.assertComponents<TComponent>(components)
        return this
    }

    /**
     * @summary Gets the accent color.
     * @description Returns the RGB accent, `null` when explicitly cleared, or `undefined` when omitted from the payload.
     * @returns The accent color, `null` if cleared, or `undefined` if unset.
     */
    public getAccentColor(): number | null | undefined {
        return this.accentColor
    }

    /**
     * @summary Sets the accent color.
     * @description Color bar as RGB from `0x000000` to `0xFFFFFF`. Pass `null` to send an empty accent.
     * @param accentColor - RGB integer, or `null` to clear.
     * @returns This container for chaining.
     */
    public setAccentColor(accentColor: number | null): this {
        this.accentColor = Container.assertAccentColor(accentColor)
        return this
    }

    /**
     * @summary Gets whether the container is a spoiler.
     * @description Returns the spoiler flag, or `undefined` when the field should be omitted from the payload.
     * @returns Whether the container is a spoiler, or `undefined` if unset.
     */
    public getSpoiler(): boolean | undefined {
        return this.spoiler
    }

    /**
     * @summary Sets whether the container is a spoiler.
     * @description Marks the container as blurred until revealed when `true`.
     * @param spoiler - Whether the container is a spoiler.
     * @returns This container for chaining.
     */
    public setSpoiler(spoiler: boolean): this {
        this.spoiler = spoiler
        return this
    }

    /**
     * @summary Converts the container to a JSON object.
     * @description Builds a Discord container payload with `type` `17` and serialized child components.
     * @returns The JSON object representation of the container.
     */
    public toJSON(): Record<string, unknown> {
        const children: TComponent[] = Container.assertComponents<TComponent>(this.components, true)
        const payload: Record<string, unknown> = {
            type: (this.constructor as typeof Container).componentType,
            components: children.map((component: TComponent) => component.toJSON()),
        }
        if (this.id !== undefined) payload.id = this.id
        if (this.accentColor !== undefined) payload.accent_color = this.accentColor
        if (this.spoiler !== undefined) payload.spoiler = this.spoiler
        return payload
    }

    /**
     * @summary Validates container children.
     * @description Ensures children are container-compatible component builders.
     * @param components - Candidate child components.
     * @param requireNonEmpty - When `true`, rejects an empty container (used when serializing).
     * @returns The validated child list.
     */
    private static assertComponents<TComponent extends AnyContainerComponent>(
        components: readonly TComponent[],
        requireNonEmpty: boolean = false,
    ): TComponent[] {
        if (!Array.isArray(components)) throw new TypeError("Container components must be an array.")
        if (requireNonEmpty && components.length < 1) {
            throw new RangeError("Container must contain at least one component.")
        }
        for (const component of components) {
            if (!(component instanceof BaseComponent)) {
                throw new TypeError("Container children must be components.")
            }
        }
        return components.slice()
    }

    /**
     * @summary Validates accent color.
     * @description Ensures the value is `null` or an integer from `0x000000` to `0xFFFFFF`.
     * @param accentColor - Candidate accent color.
     * @returns The validated accent color.
     */
    private static assertAccentColor(accentColor: number | null): number | null {
        if (accentColor === null) return null
        if (!Number.isInteger(accentColor) || accentColor < 0 || accentColor > Container.MAX_ACCENT_COLOR) {
            throw new RangeError("Container accent_color must be an integer between 0x000000 and 0xFFFFFF, or null.")
        }
        return accentColor
    }
}

export { Container }
