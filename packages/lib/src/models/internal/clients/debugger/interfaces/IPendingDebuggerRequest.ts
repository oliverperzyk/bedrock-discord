import type { IDebuggerServerResponse } from "./IDebuggerServerResponse"

/**
 * @summary Pending debugger request bookkeeping.
 * @description Tracks the resolver and chunk counters for an in-flight send/receive HTTP request.
 */
interface IPendingDebuggerRequest {
    /**
     * @summary Completion callback.
     * @description Invoked when the bridge reports progress or a terminal status.
     */
    readonly callback: (response: IDebuggerServerResponse, done?: boolean) => void
    /**
     * @summary Expected response chunk count.
     * @description Set when the backend reports that streaming has started.
     */
    totalChunks?: number
    /**
     * @summary Received response chunk count.
     * @description Incremented as `add` actions append payload fragments.
     */
    receivedChunks?: number
}

export type { IPendingDebuggerRequest }
