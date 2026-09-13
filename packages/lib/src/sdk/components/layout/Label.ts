import { ComponentType } from "../../../models/sdk/components/base/enums/ComponentType"
import type { AnyLabelComponent } from "../../../models/sdk/components/layout/label/types/AnyLabelComponent"
import { BaseComponent } from "../base/BaseComponent"
import { BaseDropdown } from "../dropdowns/base/BaseDropdown"
import { Checkbox } from "../input/checkboxes/Checkbox"
import { CheckboxGroup } from "../input/checkboxes/CheckboxGroup"
import { RadioGroup } from "../input/radio/RadioGroup"
import { TextInput } from "../input/TextInput"

/**
 * @summary Discord label wrapping a modal field with text.
 * @description Top-level layout component for modals. Associates required `label` text and an optional description with one interactive child. Prefer Label over an Action Row for text inputs.
 * @typeParam TComponent - The component builder this label holds.
 * @example
 * ```ts
 * const field: Label = new Label()
 *     .setLabel("Reason")
 *     .setDescription("Tell us why you are applying.")
 *     .setComponent(
 *         new TextInput()
 *             .setCustomId("reason")
 *             .setStyle(TextInputStyle.PARAGRAPH),
 *     )
 * ```
 */
class Label<TComponent extends AnyLabelComponent = TextInput> extends BaseComponent {
    /**
     * @summary The type of the component.
     * @description Always `ComponentType.LABEL` for label payloads sent to Discord.
     */
    protected static override readonly componentType: ComponentType = ComponentType.LABEL

    /**
     * @summary Maximum length of label text.
     * @description Discord caps Label `label` at 45 characters.
     */
    private static readonly MAX_LABEL_LENGTH: number = 45

    /**
     * @summary Maximum length of description text.
     * @description Discord caps Label `description` at 100 characters.
     */
    private static readonly MAX_DESCRIPTION_LENGTH: number = 100

    /**
     * @summary Label text shown above the field.
     * @description Required when serializing. Must be 1–45 characters.
     */
    private label: string = ""

    /**
     * @summary Optional description for the field.
     * @description May display above or below the child depending on the platform. At most 100 characters. Omitted from the payload when unset.
     */
    private description?: string

    /**
     * @summary Interactive component inside this label.
     * @description Required when serializing. A text input, select, radio group, checkbox group, or checkbox.
     */
    private component?: TComponent

    /**
     * @summary Creates a label.
     * @description Starts with no text or child. Set {@link Label.setLabel} and {@link Label.setComponent} before sending.
     */
    public constructor() {
        super()
    }

    /**
     * @summary Gets the label text.
     * @description Returns the required `label` string, which may still be empty before {@link Label.setLabel}.
     * @returns The label text.
     */
    public getLabel(): string {
        return this.label
    }

    /**
     * @summary Sets the label text.
     * @description Replaces `label`. Must be 1–45 characters.
     * @param label - Label text shown with the field.
     * @returns This label for chaining.
     */
    public setLabel(label: string): this {
        this.label = Label.assertLabel(label)
        return this
    }

    /**
     * @summary Gets the description text.
     * @description Returns the optional description, or `undefined` when unset.
     * @returns The description, or `undefined` if unset.
     */
    public getDescription(): string | undefined {
        return this.description
    }

    /**
     * @summary Sets the description text.
     * @description Optional helper text. Maximum 100 characters.
     * @param description - Description shown with the field.
     * @returns This label for chaining.
     */
    public setDescription(description: string): this {
        this.description = Label.assertDescription(description)
        return this
    }

    /**
     * @summary Gets the child component.
     * @description Returns the interactive component inside this label, or `undefined` when unset.
     * @returns The child component, or `undefined` if unset.
     */
    public getComponent(): TComponent | undefined {
        return this.component
    }

    /**
     * @summary Sets the child component.
     * @description Associates one allowed modal component with this label. Required when serializing.
     * @param component - Text input, select, radio group, checkbox group, or checkbox.
     * @returns This label for chaining.
     */
    public setComponent(component: TComponent): this {
        this.component = Label.assertComponent(component)
        return this
    }

    /**
     * @summary Converts the label to a JSON object.
     * @description Builds a Discord label payload with `type` `18`, required `label` and `component`, and optional `description`.
     * @returns The JSON object representation of the label.
     */
    public toJSON(): Record<string, unknown> {
        const payload: Record<string, unknown> = {
            type: Label.componentType,
            label: Label.assertLabel(this.label),
            component: Label.assertComponent(this.component).toJSON(),
        }
        if (this.id !== undefined) payload.id = this.id
        if (this.description !== undefined) payload.description = this.description
        return payload
    }

    /**
     * @summary Validates label text.
     * @description Ensures `label` is a string of 1–45 characters.
     * @param label - Candidate label text.
     * @returns The validated label text.
     */
    private static assertLabel(label: string): string {
        if (typeof label !== "string") throw new TypeError("Label label must be a string.")
        if (label.length < 1 || label.length > Label.MAX_LABEL_LENGTH) {
            throw new RangeError("Label label must be between 1 and 45 characters.")
        }
        return label
    }

    /**
     * @summary Validates description text.
     * @description Ensures `description` is a string of at most 100 characters.
     * @param description - Candidate description.
     * @returns The validated description.
     */
    private static assertDescription(description: string): string {
        if (typeof description !== "string") throw new TypeError("Label description must be a string.")
        if (description.length > Label.MAX_DESCRIPTION_LENGTH) {
            throw new RangeError("Label description must be at most 100 characters.")
        }
        return description
    }

    /**
     * @summary Validates the child component.
     * @description Ensures the child is a text input, select, radio group, checkbox group, or checkbox.
     * @param component - Candidate child.
     * @returns The validated child.
     */
    private static assertComponent<TComponent extends AnyLabelComponent>(
        component: TComponent | undefined,
    ): TComponent {
        if (
            !(component instanceof TextInput) &&
            !(component instanceof BaseDropdown) &&
            !(component instanceof RadioGroup) &&
            !(component instanceof CheckboxGroup) &&
            !(component instanceof Checkbox)
        ) {
            throw new TypeError(
                "Label component must be a text input, select, radio group, checkbox group, or checkbox.",
            )
        }
        return component
    }
}

export { Label }
