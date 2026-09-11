import { ComponentType } from "../../../models/sdk/components/base/enums/ComponentType"
import type { IUnfurledMediaItem } from "../../../models/sdk/components/display/unfurled-media/interfaces/IUnfurledMediaItem"
import { BaseComponent } from "../base/BaseComponent"

/**
 * @summary Discord file component for an uploaded attachment.
 * @description Top-level content component for messages. Displays one attached file referenced with `attachment://filename`. Requires the `IS_COMPONENTS_V2` message flag (`1 << 15`). Response-only `name` and `size` are not sent.
 * @example
 * ```ts
 * const file: File = new File()
 *     .setURL("attachment://game.zip")
 *     .setSpoiler(false)
 * ```
 */
class File extends BaseComponent {
    /**
     * @summary The type of the component.
     * @description Always `ComponentType.FILE` for file payloads sent to Discord.
     */
    protected static override readonly componentType: ComponentType = ComponentType.FILE

    /**
     * @summary Attachment URL prefix.
     * @description File components only accept unfurled media URLs using the `attachment://` protocol.
     */
    private static readonly ATTACHMENT_URL_PREFIX: string = "attachment://"

    /**
     * @summary Attached file URL.
     * @description `attachment://filename` reference to an uploaded file. Required when serializing.
     */
    private url?: string

    /**
     * @summary Spoiler state.
     * @description Whether the file is blurred until revealed. Discord defaults this to `false` when omitted.
     */
    private spoiler?: boolean

    /**
     * @summary Creates a file component.
     * @description Starts with no attachment URL or spoiler. Set a URL with {@link File.setURL} before sending.
     */
    public constructor() {
        super()
    }

    /**
     * @summary Gets the attachment URL.
     * @description Returns the `attachment://filename` URL, or `undefined` when unset.
     * @returns The attachment URL, or `undefined` if unset.
     */
    public getURL(): string | undefined {
        return this.url
    }

    /**
     * @summary Sets the attachment URL.
     * @description Must use `attachment://filename` and reference a file uploaded with the message.
     * @param url - Attachment URL.
     * @returns This file for chaining.
     */
    public setURL(url: string): this {
        this.url = File.assertURL(url)
        return this
    }

    /**
     * @summary Gets whether the file is a spoiler.
     * @description Returns the spoiler flag, or `undefined` when the field should be omitted from the payload.
     * @returns Whether the file is a spoiler, or `undefined` if unset.
     */
    public getSpoiler(): boolean | undefined {
        return this.spoiler
    }

    /**
     * @summary Sets whether the file is a spoiler.
     * @description Marks the file as blurred until revealed when `true`.
     * @param spoiler - Whether the file is a spoiler.
     * @returns This file for chaining.
     */
    public setSpoiler(spoiler: boolean): this {
        this.spoiler = spoiler
        return this
    }

    /**
     * @summary Converts the file to a JSON object.
     * @description Builds a Discord file payload with `type` `13`, required `file.url`, and optional `spoiler`.
     * @returns The JSON object representation of the file.
     */
    public toJSON(): Record<string, unknown> {
        const file: IUnfurledMediaItem = { url: File.assertURL(this.url) }
        const payload: Record<string, unknown> = {
            type: (this.constructor as typeof File).componentType,
            file,
        }
        if (this.id !== undefined) payload.id = this.id
        if (this.spoiler !== undefined) payload.spoiler = this.spoiler
        return payload
    }

    /**
     * @summary Validates the attachment URL.
     * @description Ensures the value is a non-empty `attachment://filename` reference.
     * @param url - Candidate URL.
     * @returns The validated URL.
     */
    private static assertURL(url: string | undefined): string {
        if (typeof url !== "string" || url.length < 1) {
            throw new TypeError("File url must be a non-empty string.")
        }
        if (!url.startsWith(File.ATTACHMENT_URL_PREFIX)) {
            throw new TypeError("File url must use the attachment:// protocol.")
        }
        if (url.length <= File.ATTACHMENT_URL_PREFIX.length) {
            throw new RangeError("File url must include a filename after attachment://.")
        }
        return url
    }
}

export { File }
