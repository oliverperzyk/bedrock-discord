import { MiddlewareFunctionReturnType } from "@/oliverperzyk/models/api/middlewares/base/types/MiddlewareFunctionReturnType"
import type { NextFunction, Request, Response } from "express"

/**
 * @summary Abstract class for the base middleware.
 * @description Defines the middleware contract; concrete subclasses are instantiated via {@link middleware}.
 */
abstract class BaseMiddleware {
    /**
     * @summary Cached middleware instances by constructor.
     * @description Ensures each concrete subclass gets a single shared instance.
     */
    private static readonly instances: WeakMap<object, BaseMiddleware> = new WeakMap()

    /**
     * @summary Protected constructor.
     * @description Prevents direct construction outside subclass factories.
     */
    protected constructor() {}

    /**
     * @summary Express middleware function for this class.
     * @description Creates (once) an instance of the concrete subclass that extends {@link BaseMiddleware}, then returns its bound `handle`.
     */
    public static get middleware(): MiddlewareFunctionReturnType {
        if (this === BaseMiddleware) {
            throw new Error("BaseMiddleware.middleware must be accessed on a concrete subclass.")
        }

        const Constructor: new () => BaseMiddleware = this as unknown as new () => BaseMiddleware
        let instance: BaseMiddleware | undefined = BaseMiddleware.instances.get(Constructor)

        if (instance === undefined) {
            instance = new Constructor()
            BaseMiddleware.instances.set(Constructor, instance)
        }

        return instance.handle.bind(instance)
    }

    /**
     * @summary Method to handle the middleware.
     * @description Handles the middleware request and response for a concrete subclass.
     * @param request - The request object from Express.js library.
     * @param response - The response object from Express.js library.
     * @param next - The next function that moves the request to the next middleware.
     * @returns The result of the middleware execution.
     */
    public abstract handle(request: Request, response: Response, next: NextFunction): unknown
}

export { BaseMiddleware }
