import type { ComponentType } from "../../../models/sdk/components/base/enums/ComponentType"

/**
 * @summary Base component class.
 * @description Base class for all components that implements the base component interface.
 */
abstract class BaseComponent {
    public constructor() {}

    /**
     * @summary The type of the component.
     * @description The type of the component, used to determine the type of the component when sending it to the Discord API.
     */
    protected static readonly componentType: ComponentType

    /**
     * @summary Converts the component to a JSON object.
     * @description Converts the component to a JSON object, used to send the component to the Discord API.
     * @returns The JSON object representation of the component.
     */
    public abstract toJSON(): Record<string, unknown>
}

export { BaseComponent }
