import type { HttpHeader } from "@minecraft/server-net"

/**
 * @summary Represents the data for performing an HTTP request.
 * @description Additional data for performing an HTTP request.
 * @template D - The type of the data in the response.
 * @template E - The type of the error in the response.
 */
interface IHttpPerformRequestData {
    /**
     * @summary The headers of the request.
     * @description HTTP headers of the request.
     */
    readonly headers?: HttpHeader[]
    /**
     * @summary The body of the request.
     * @description The body of the request.
     */
    readonly body?: unknown
    /**
     * @summary The timeout of the request.
     * @description The timeout of the request.
     */
    readonly timeout?: number
}

export type { IHttpPerformRequestData }
