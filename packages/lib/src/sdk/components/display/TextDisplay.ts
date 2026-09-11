import { ComponentType } from "../../../models/sdk/components/base/enums/ComponentType"
import { BaseComponent } from "../base/BaseComponent"

/**
 * @summary Discord text display for markdown content.
 * @description Top-level content component for messages and modals. Renders markdown like message `content`, including mentions and emojis. Requires the `IS_COMPONENTS_V2` message flag (`1 << 15`) when used in messages.
 * @example
 * ```ts
 * const text: TextDisplay = new TextDisplay()
 *     .setContent("# Welcome\nYou can use **markdown**, lists, and :blush:")
 * ```
 */
class TextDisplay extends BaseComponent {
    /**
     * @summary The type of the component.
     * @description Always `ComponentType.TEXT_DISPLAY` for text display payloads sent to Discord.
     */
    protected static override readonly componentType: ComponentType = ComponentType.TEXT_DISPLAY

    /**
     * @summary Maximum content length.
     * @description Discord caps text display `content` at 4000 characters.
     */
    private static readonly MAX_CONTENT_LENGTH: number = 4000

    /**
     * @summary Displayed text.
     * @description Markdown content shown like a message body. Required when serializing.
     */
    private content?: string

    /**
     * @summary Creates a text display.
     * @description Starts with no content. Set text with {@link TextDisplay.setContent} before sending.
     */
    public constructor() {
        super()
    }

    /**
     * @summary Gets the displayed text.
     * @description Returns the markdown content, or `undefined` when unset.
     * @returns The content, or `undefined` if unset.
     */
    public getContent(): string | undefined {
        return this.content
    }

    /**
     * @summary Sets the displayed text.
     * @description Markdown string shown like message content. Maximum 4000 characters.
     * @param content - Text to display.
     * @returns This text display for chaining.
     */
    public setContent(content: string): this {
        this.content = TextDisplay.assertContent(content)
        return this
    }

    /**
     * @summary Converts the text display to a JSON object.
     * @description Builds a Discord text display payload with `type` `10` and required `content`.
     * @returns The JSON object representation of the text display.
     */
    public toJSON(): Record<string, unknown> {
        const payload: Record<string, unknown> = {
            type: (this.constructor as typeof TextDisplay).componentType,
            content: TextDisplay.assertContent(this.content),
        }
        if (this.id !== undefined) payload.id = this.id
        return payload
    }

    /**
     * @summary Validates display content.
     * @description Ensures the value is a non-empty string of at most 4000 characters.
     * @param content - Candidate content.
     * @returns The validated content.
     */
    private static assertContent(content: string | undefined): string {
        if (typeof content !== "string" || content.length < 1) {
            throw new TypeError("Text display content must be a non-empty string.")
        }
        if (content.length > TextDisplay.MAX_CONTENT_LENGTH) {
            throw new RangeError("Text display content must be at most 4000 characters.")
        }
        return content
    }
}

export { TextDisplay }
