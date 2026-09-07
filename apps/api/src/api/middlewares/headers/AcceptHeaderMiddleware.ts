import type { NextFunction, Request, Response } from "express"
import { BaseMiddleware } from "../base/BaseMiddleware"
import { NotAcceptableResponseBuilder } from "@/oliverperzyk/models/builders/responses/errors/NotAcceptableResponseBuilder"

/**
 * @summary Middleware to check the Accept header.
 * @description Middleware makes a basic check whenever a request is made using library's standard Accept header.
 */
class AcceptHeaderMiddleware extends BaseMiddleware {
    /**
     * @summary Protected constructor.
     * @description Prevents instantiation of the class.
     */
    protected constructor() {
        super()
    }

    /**
     * @summary Handles the middleware request and response.
     * @description Checks if the Accept header is acceptable. If not, sends a 406 status code.
     * @param request - The request object from Express.js library.
     * @param response - The response object from Express.js library.
     * @param next - The next function that moves the request to the next middleware.
     */
    public handle(request: Request, response: Response, next: NextFunction): void {
        const acceptHeader: string | undefined = request.headers["accept"]?.toLowerCase().trim()
        if (!acceptHeader) return next()

        const [type] = acceptHeader.split(";")
        if (type === "*/*") return next()
        const [mainSubtype, minorSubtype] = type.split("/")
        if (mainSubtype === "application" && (minorSubtype === "json" || minorSubtype === "*")) return next()
        response.status(406).json(NotAcceptableResponseBuilder.acceptHeaderNotAcceptable)
    }
}

export { AcceptHeaderMiddleware }
