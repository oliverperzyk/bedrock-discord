import type { ComponentType } from "../../../models/sdk/components/base/enums/ComponentType"

/**
 * @summary Base component class.
 * @description Base class for all components that implements the base component interface.
 */
abstract class BaseComponent {
    /**
     * @summary Optional component identifier.
     * @description 32-bit integer used to identify this button in an interaction response. Discord generates one if omitted.
     */
    protected id?: number

    /**
     * @summary The type of the component.
     * @description The type of the component, used to determine the type of the component when sending it to the Discord API.
     */
    protected static readonly componentType: ComponentType | null

    /**
     * @summary Gets the component identifier.
     * @description Returns the optional 32-bit component `id`, or `undefined` when Discord should generate one.
     * @returns The component identifier, or `undefined` if unset.
     */
    public getId(): number | undefined {
        return this.id
    }

    /**
     * @summary Sets the component identifier.
     * @description Assigns a 32-bit component `id`. Sending `0` is treated by Discord as empty and replaced.
     * @param id - The component identifier.
     * @returns This button for chaining.
     */
    public setId(id: number): this {
        if (!Number.isInteger(id) || id < 0 || id > 0xffffffff) {
            throw new RangeError("Component's identifier must be a 32-bit unsigned integer.")
        }
        this.id = id
        return this
    }

    /**
     * @summary Converts the component to a JSON object.
     * @description Converts the component to a JSON object, used to send the component to the Discord API.
     * @returns The JSON object representation of the component.
     */
    public abstract toJSON(): Record<string, unknown>
}

export { BaseComponent }
