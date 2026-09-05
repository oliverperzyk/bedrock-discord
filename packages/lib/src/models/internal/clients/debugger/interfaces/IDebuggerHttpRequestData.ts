import type { IDebuggerRequestInit } from "./IDebuggerRequestInit"

/**
 * @summary Payload for a debugger HTTP bridge request.
 * @description URI and fetch-style init options forwarded to the debugger microservice.
 */
interface IDebuggerHttpRequestData {
    /**
     * @summary Target URI.
     * @description Absolute URL the backend should request.
     */
    readonly uri: string
    /**
     * @summary Fetch-style init options.
     * @description Method, headers, and body forwarded to the backend HTTP client.
     */
    readonly init?: IDebuggerRequestInit
}

export type { IDebuggerHttpRequestData }
