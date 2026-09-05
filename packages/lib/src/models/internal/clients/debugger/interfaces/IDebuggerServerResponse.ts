import type { DebuggerServerStatus } from "../enums/DebuggerServerStatus"

/**
 * @summary Response returned by the debugger HTTP bridge.
 * @description Normalized callback payload used while resolving a pending HTTP request.
 */
interface IDebuggerServerResponse {
    /**
     * @summary Bridge status code.
     * @description Protocol status from the debugger, not necessarily an HTTP status code.
     */
    readonly status: DebuggerServerStatus
    /**
     * @summary Raw response body.
     * @description String payload assembled from backend chunks, when available.
     */
    readonly data?: string
    /**
     * @summary Optional status message.
     * @description Human-readable bridge message such as a timeout or failure reason.
     */
    readonly message?: string
    /**
     * @summary Parsed body accessor.
     * @description Returns JSON-parsed data when the backend provided structured content.
     */
    readonly getData: () => unknown
}

export type { IDebuggerServerResponse }
