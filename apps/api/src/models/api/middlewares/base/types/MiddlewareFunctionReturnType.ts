import type { NextFunction, Request, Response } from "express"

/**
 * @summary Type for the middleware function return type.
 * @description This type defines what `handle` method of the middleware contract must return.
 */
type MiddlewareFunctionReturnType = (_req: Request, _res: Response, _next: NextFunction) => unknown

export type { MiddlewareFunctionReturnType }
