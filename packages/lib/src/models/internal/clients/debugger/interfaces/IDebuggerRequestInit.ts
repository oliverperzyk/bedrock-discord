/**
 * @summary Fetch-style options for a debugger HTTP request.
 * @description Method, headers, and body forwarded to the debugger microservice.
 */
interface IDebuggerRequestInit {
    /**
     * @summary HTTP method.
     * @description Verb such as GET, POST, PUT, DELETE, or PATCH.
     */
    readonly method?: string
    /**
     * @summary Request headers.
     * @description Plain header map sent with the outbound HTTP call.
     */
    readonly headers?: Readonly<Record<string, string>>
    /**
     * @summary Request body.
     * @description Serialized body string when the method carries a payload.
     */
    readonly body?: string
}

export type { IDebuggerRequestInit }
