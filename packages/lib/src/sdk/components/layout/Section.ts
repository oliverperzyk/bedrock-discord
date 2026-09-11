import { ComponentType } from "../../../models/sdk/components/base/enums/ComponentType"
import type { AnySectionAccessory } from "../../../models/sdk/components/layout/section/types/AnySectionAccessory"
import type { AnySectionComponent } from "../../../models/sdk/components/layout/section/types/AnySectionComponent"
import { BaseComponent } from "../base/BaseComponent"
import { TextDisplay } from "../display/TextDisplay"

/**
 * @summary Discord section associating content with an accessory.
 * @description Top-level layout component for messages. Holds one to three child components (currently text displays) plus a required accessory such as a button or thumbnail. Requires the `IS_COMPONENTS_V2` message flag (`1 << 15`).
 * @typeParam TComponent - The component builders this section holds as content.
 * @example
 * ```ts
 * const section: Section = new Section()
 *     .addComponents(
 *         new TextDisplay().setContent("# Game Changelog"),
 *         new TextDisplay().setContent("Fixed several crashes and improved performance."),
 *     )
 *     .setAccessory(new InteractiveButton().setCustomId("changelog").setLabel("Full notes"))
 * ```
 */
class Section<TComponent extends AnySectionComponent = TextDisplay> extends BaseComponent {
    /**
     * @summary The type of the component.
     * @description Always `ComponentType.SECTION` for section payloads sent to Discord.
     */
    protected static override readonly componentType: ComponentType = ComponentType.SECTION

    /**
     * @summary Maximum number of child components.
     * @description Discord allows at most three children in one section.
     */
    private static readonly MAX_COMPONENTS: number = 3

    /**
     * @summary Child components in this section.
     * @description Content contextually associated with the accessory. Currently one to three text displays.
     */
    private components: TComponent[] = []

    /**
     * @summary Accessory shown beside the content.
     * @description Required when serializing. A button or a {@link SectionAccessory} such as a thumbnail.
     */
    private accessory?: AnySectionAccessory

    /**
     * @summary Creates a section.
     * @description Starts with no children or accessory. Add content with {@link Section.addComponents} or {@link Section.setComponents} and set an accessory with {@link Section.setAccessory} before sending.
     */
    public constructor() {
        super()
    }

    /**
     * @summary Gets the child components.
     * @description Returns a copy of the content components currently in this section.
     * @returns The child components in insertion order.
     */
    public getComponents(): TComponent[] {
        return this.components.slice()
    }

    /**
     * @summary Appends child components.
     * @description Adds children of type {@link TComponent} to the end of the section. Combined length cannot exceed three.
     * @param components - Components to append.
     * @returns This section for chaining.
     */
    public addComponents(...components: TComponent[]): this {
        this.components = Section.assertComponents<TComponent>(this.components.concat(components))
        return this
    }

    /**
     * @summary Replaces all child components.
     * @description Overwrites the section content with builders of type {@link TComponent}. Pass one to three children before serializing.
     * @param components - Components that become the full contents of the section.
     * @returns This section for chaining.
     */
    public setComponents(...components: TComponent[]): this {
        this.components = Section.assertComponents<TComponent>(components)
        return this
    }

    /**
     * @summary Gets the accessory component.
     * @description Returns the accessory shown beside the content, or `undefined` when unset.
     * @returns The accessory, or `undefined` if unset.
     */
    public getAccessory(): AnySectionAccessory | undefined {
        return this.accessory
    }

    /**
     * @summary Sets the accessory component.
     * @description Associates a button or section accessory with the section content. Required when serializing.
     * @param accessory - Accessory component.
     * @returns This section for chaining.
     */
    public setAccessory(accessory: AnySectionAccessory): this {
        this.accessory = Section.assertAccessory(accessory)
        return this
    }

    /**
     * @summary Converts the section to a JSON object.
     * @description Builds a Discord section payload with `type` `9`, serialized children, and a required accessory.
     * @returns The JSON object representation of the section.
     */
    public toJSON(): Record<string, unknown> {
        const children: TComponent[] = Section.assertComponents<TComponent>(this.components, true)
        const payload: Record<string, unknown> = {
            type: (this.constructor as typeof Section).componentType,
            components: children.map((component: TComponent) => component.toJSON()),
            accessory: Section.assertAccessory(this.accessory).toJSON(),
        }
        if (this.id !== undefined) payload.id = this.id
        return payload
    }

    /**
     * @summary Validates section children.
     * @description Ensures children are section-compatible component builders and the list stays within Discord's 1–3 limit.
     * @param components - Candidate child components.
     * @param requireNonEmpty - When `true`, rejects an empty section (used when serializing).
     * @returns The validated child list.
     */
    private static assertComponents<TComponent extends AnySectionComponent>(
        components: readonly TComponent[],
        requireNonEmpty: boolean = false,
    ): TComponent[] {
        if (!Array.isArray(components)) throw new TypeError("Section components must be an array.")
        if (requireNonEmpty && components.length < 1) {
            throw new RangeError("Section must contain at least one component.")
        }
        if (components.length > Section.MAX_COMPONENTS) {
            throw new RangeError("Section can contain at most 3 components.")
        }
        for (const component of components) {
            if (!(component instanceof BaseComponent)) {
                throw new TypeError("Section children must be components.")
            }
        }
        return components.slice()
    }

    /**
     * @summary Validates a section accessory.
     * @description Ensures the accessory is a component builder Discord can show beside section content.
     * @param accessory - Candidate accessory.
     * @returns The validated accessory.
     */
    private static assertAccessory(accessory: AnySectionAccessory | undefined): AnySectionAccessory {
        if (!(accessory instanceof BaseComponent)) {
            throw new TypeError("Section accessory must be a component.")
        }
        return accessory
    }
}

export { Section }
