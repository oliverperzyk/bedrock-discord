/**
 * @summary Debugger bridge response statuses.
 * @description Status codes returned by the debugger microservice while handling a request.
 */
enum DebuggerServerStatus {
    /**
     * @summary Response streaming in progress.
     * @description The backend is still delivering response chunks.
     */
    Running = -2,
    /**
     * @summary Request was accepted and ran.
     * @description Intermediate status before the final success or failure payload.
     */
    Ran = -1,
    /**
     * @summary Request completed successfully.
     * @description The bridge finished and response data is available.
     */
    Success = 0,
    /**
     * @summary Request failed.
     * @description The bridge could not complete the request (including timeouts).
     */
    Failure = 1,
}

export { DebuggerServerStatus }
