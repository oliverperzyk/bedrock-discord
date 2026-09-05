/**
 * @summary Debugger bridge request kinds.
 * @description Request type identifiers for the bedrock-discord debugger protocol.
 */
enum DebuggerRequestType {
    /**
     * @summary HTTP request.
     * @description Asks the debugger microservice to perform a fetch-like HTTP call.
     */
    HttpRequest = "httpRequest",
}

export { DebuggerRequestType }
