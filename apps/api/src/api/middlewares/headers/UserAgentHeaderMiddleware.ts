import type { NextFunction, Request, Response } from "express"
import { BaseMiddleware } from "../base/BaseMiddleware"
import { ForbiddenResponseBuilder } from "@/oliverperzyk/models/builders/responses/errors/ForbiddenResponseBuilder"

/**
 * @summary Middleware to check the User-Agent header.
 * @description Middleware makes a basic check whenever a request is made using library's standard User-Agent header.
 */
class UserAgentHeaderMiddleware extends BaseMiddleware {
    /**
     * @summary Protected constructor.
     * @description Prevents instantiation of the class.
     */
    protected constructor() {
        super()
    }

    /**
     * @summary Handles the middleware request and response.
     * @description Checks if the User-Agent header is "Bedrock-Discord". If not, sends a 403 status code.
     * @param request - The request object from Express.js library.
     * @param response - The response object from Express.js library.
     * @param next - The next function that moves the request to the next middleware.
     */
    public handle(request: Request, response: Response, next: NextFunction): void {
        const userAgent: string | undefined = request.headers["user-agent"]
        if (userAgent !== "Bedrock-Discord") {
            response.status(403).json(ForbiddenResponseBuilder.forbiddenInvalidUserAgentHeader)
        }

        next()
    }
}

export { UserAgentHeaderMiddleware }
