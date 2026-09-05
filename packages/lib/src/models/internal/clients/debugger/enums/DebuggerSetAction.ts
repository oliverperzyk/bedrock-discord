/**
 * @summary Debugger dynamic-property mutation actions.
 * @description Actions the debugger uses when writing chunked response data back into the pack.
 */
enum DebuggerSetAction {
    /**
     * @summary Replace stored response data.
     * @description Overwrites the buffered response for a request id.
     */
    Set = "set",
    /**
     * @summary Clear stored response data.
     * @description Removes the buffered response for a request id.
     */
    Reset = "reset",
    /**
     * @summary Append response chunk.
     * @description Concatenates additional payload bytes onto the buffered response.
     */
    Add = "add",
    /**
     * @summary Read stored response data.
     * @description Returns the current buffered response for a request id.
     */
    Get = "get",
    /**
     * @summary Remove a pending request.
     * @description Deletes request dynamic properties for a request id.
     */
    Remove = "remove",
}

export { DebuggerSetAction }
