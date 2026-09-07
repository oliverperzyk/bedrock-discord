import type { IBaseResponse } from "./IBaseResponse"

/**
 * @summary Abstract class for the base response builder.
 * @description Defines the response contract; concrete subclasses are instantiated via {@link build}.
 */
abstract class BaseResponseBuilder {
    /**
     * @summary Cached builder instances by constructor.
     * @description Ensures each concrete subclass gets a single shared instance.
     */
    private static readonly instances: WeakMap<object, BaseResponseBuilder> = new WeakMap()

    /**
     * @summary Protected constructor.
     * @description Prevents direct construction outside subclass factories.
     */
    protected constructor() {}

    /**
     * @summary HTTP status code of the response.
     * @description Must be defined by each concrete subclass.
     */
    public abstract readonly HTTP_STATUS_CODE: number

    /**
     * @summary Whether the response represents a successful operation.
     * @description Must be defined by each concrete subclass.
     */
    public abstract readonly IS_SUCCESSFUL: boolean

    /**
     * @summary Shared instance of the concrete subclass.
     * @description Creates (once) an instance of the subclass that accessed this getter.
     */
    private static getInstance(): BaseResponseBuilder {
        if (this === BaseResponseBuilder) {
            throw new Error("BaseResponseBuilder.build must be accessed on a concrete subclass.")
        }

        const Constructor: new () => BaseResponseBuilder = this as unknown as new () => BaseResponseBuilder
        let instance: BaseResponseBuilder | undefined = BaseResponseBuilder.instances.get(Constructor)

        if (instance === undefined) {
            instance = new Constructor()
            BaseResponseBuilder.instances.set(Constructor, instance)
        }

        return instance
    }

    /**
     * @summary Builds a response object for this class.
     * @description Uses the cached subclass instance so {@link HTTP_STATUS_CODE} and {@link IS_SUCCESSFUL} are read from the concrete builder.
     * @param message - A short message that summarizes the response.
     * @param data - The payload stored as `data` on success, or `error` on failure.
     * @returns The built response object.
     */
    public static build<D = unknown>(message: string, data: D): IBaseResponse<D> {
        const instance: BaseResponseBuilder = this.getInstance()
        const timestamp: string = new Date().toISOString()

        if (instance.IS_SUCCESSFUL) {
            return {
                status: instance.HTTP_STATUS_CODE,
                message,
                timestamp,
                success: true,
                data,
            }
        }

        return {
            status: instance.HTTP_STATUS_CODE,
            message,
            timestamp,
            success: false,
            error: data,
        }
    }
}

export { BaseResponseBuilder }
