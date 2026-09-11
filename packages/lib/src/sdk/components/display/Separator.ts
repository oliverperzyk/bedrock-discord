import { ComponentType } from "../../../models/sdk/components/base/enums/ComponentType"
import { SeparatorSpacingSize } from "../../../models/sdk/components/display/separator/enums/SeparatorSpacingSize"
import { BaseComponent } from "../base/BaseComponent"

/**
 * @summary Discord separator for padding and visual division.
 * @description Top-level layout component for messages. Adds vertical space between components and an optional divider line. Requires the `IS_COMPONENTS_V2` message flag (`1 << 15`). Discord defaults `divider` to `true` and `spacing` to small when omitted.
 * @example
 * ```ts
 * const separator: Separator = new Separator()
 *     .setDivider(true)
 *     .setSpacing(SeparatorSpacingSize.SMALL)
 * ```
 */
class Separator extends BaseComponent {
    /**
     * @summary The type of the component.
     * @description Always `ComponentType.SEPARATOR` for separator payloads sent to Discord.
     */
    protected static override readonly componentType: ComponentType = ComponentType.SEPARATOR

    /**
     * @summary Visual divider flag.
     * @description Whether a line is shown in the separator. Discord defaults this to `true` when omitted.
     */
    private divider?: boolean

    /**
     * @summary Padding size.
     * @description `SeparatorSpacingSize.SMALL` (`1`) or `SeparatorSpacingSize.LARGE` (`2`). Discord defaults to small when omitted.
     */
    private spacing?: SeparatorSpacingSize

    /**
     * @summary Creates a separator.
     * @description Starts with no divider or spacing overrides. Both fields are optional when serializing.
     */
    public constructor() {
        super()
    }

    /**
     * @summary Gets whether a divider is shown.
     * @description Returns the divider flag, or `undefined` when the field should be omitted from the payload.
     * @returns Whether a visual divider is shown, or `undefined` if unset.
     */
    public getDivider(): boolean | undefined {
        return this.divider
    }

    /**
     * @summary Sets whether a divider is shown.
     * @description Displays a visual line when `true`. Discord defaults to showing a divider when omitted.
     * @param divider - Whether a visual divider should be displayed.
     * @returns This separator for chaining.
     */
    public setDivider(divider: boolean): this {
        this.divider = divider
        return this
    }

    /**
     * @summary Gets the padding size.
     * @description Returns the spacing, or `undefined` when the field should be omitted from the payload.
     * @returns The spacing size, or `undefined` if unset.
     */
    public getSpacing(): SeparatorSpacingSize | undefined {
        return this.spacing
    }

    /**
     * @summary Sets the padding size.
     * @description `1` for small padding or `2` for large padding. Discord defaults to small when omitted.
     * @param spacing - Separator padding size.
     * @returns This separator for chaining.
     */
    public setSpacing(spacing: SeparatorSpacingSize): this {
        this.spacing = Separator.assertSpacing(spacing)
        return this
    }

    /**
     * @summary Converts the separator to a JSON object.
     * @description Builds a Discord separator payload with `type` `14` and optional `divider` and `spacing`.
     * @returns The JSON object representation of the separator.
     */
    public toJSON(): Record<string, unknown> {
        const payload: Record<string, unknown> = {
            type: Separator.componentType,
        }
        if (this.id !== undefined) payload.id = this.id
        if (this.divider !== undefined) payload.divider = this.divider
        if (this.spacing !== undefined) payload.spacing = this.spacing
        return payload
    }

    /**
     * @summary Validates separator spacing.
     * @description Ensures the value is `SeparatorSpacingSize.SMALL` or `SeparatorSpacingSize.LARGE`.
     * @param spacing - Candidate spacing.
     * @returns The validated spacing.
     */
    private static assertSpacing(spacing: SeparatorSpacingSize): SeparatorSpacingSize {
        if (spacing !== SeparatorSpacingSize.SMALL && spacing !== SeparatorSpacingSize.LARGE) {
            throw new RangeError("Separator spacing must be SeparatorSpacingSize.SMALL or SeparatorSpacingSize.LARGE.")
        }
        return spacing
    }
}

export { Separator, SeparatorSpacingSize }
