import type { DebuggerRequestType } from "../enums/DebuggerRequestType"
import type { IDebuggerHttpRequestData } from "./IDebuggerHttpRequestData"

/**
 * @summary Envelope written to bedrock-discord request dynamic properties.
 * @description Top-level request object consumed by the debugger microservice.
 */
interface IDebuggerRequest {
    /**
     * @summary Unique request id.
     * @description Correlates backend responses with the pending in-game promise.
     */
    readonly id: string
    /**
     * @summary Bridge request type.
     * @description Currently only HTTP requests are used by this library.
     */
    readonly type: DebuggerRequestType
    /**
     * @summary API / pack name.
     * @description Identifies this library to the debugger microservice.
     */
    readonly apiName: string
    /**
     * @summary Whether script events are used.
     * @description When true, responses arrive via `bedrock-discord:*` script events.
     */
    readonly scriptEvent: boolean
    /**
     * @summary Request-specific payload.
     * @description HTTP URI and init options for {@link DebuggerRequestType.HttpRequest}.
     */
    readonly data: IDebuggerHttpRequestData
}

export type { IDebuggerRequest }
