import type { NextFunction, Request, Response } from "express"
import { BaseMiddleware } from "../base/BaseMiddleware"
import { UnsupportedMediaTypeResponseBuilder } from "@/oliverperzyk/models/builders/responses/errors/UnsupportedMediaTypeResponseBuilder"

/**
 * @summary Middleware to check the Content-Type header.
 * @description Middleware makes a basic check whenever a request is made using library's standard Content-Type header.
 */
class ContentTypeHeaderMiddleware extends BaseMiddleware {
    /**
     * @summary Protected constructor.
     * @description Prevents instantiation of the class.
     */
    protected constructor() {
        super()
    }

    /**
     * @summary Handles the middleware request and response.
     * @description Checks if the Content-Type header is supported. If not, sends a 415 status code.
     * @param request - The request object from Express.js library.
     * @param response - The response object from Express.js library.
     * @param next - The next function that moves the request to the next middleware.
     */
    public handle(request: Request, response: Response, next: NextFunction): unknown {
        const contentTypeHeader: string | undefined = request.headers["content-type"]?.toLowerCase().trim()
        if (!contentTypeHeader)
            return response.status(415).json(UnsupportedMediaTypeResponseBuilder.contentTypeNotSupported)
        const [type] = contentTypeHeader.split(";")
        const [mainSubtype, minorSubtype] = type.split("/")
        if (mainSubtype !== "application" || minorSubtype !== "json")
            return response.status(415).json(UnsupportedMediaTypeResponseBuilder.contentTypeNotSupported)
        next()
    }
}

export { ContentTypeHeaderMiddleware }
