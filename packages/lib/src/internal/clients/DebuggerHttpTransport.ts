/// <reference types="node" />

import { system, world } from "@minecraft/server"
import { DebuggerRequestType } from "../../models/internal/clients/debugger/enums/DebuggerRequestType"
import { DebuggerServerStatus } from "../../models/internal/clients/debugger/enums/DebuggerServerStatus"
import { DebuggerSetAction } from "../../models/internal/clients/debugger/enums/DebuggerSetAction"
import type { IDebuggerRequest } from "../../models/internal/clients/debugger/interfaces/IDebuggerRequest"
import type { IDebuggerRequestInit } from "../../models/internal/clients/debugger/interfaces/IDebuggerRequestInit"
import type { IDebuggerServerResponse } from "../../models/internal/clients/debugger/interfaces/IDebuggerServerResponse"
import type { IPendingDebuggerRequest } from "../../models/internal/clients/debugger/interfaces/IPendingDebuggerRequest"

/**
 * @summary Debugger HTTP bridge for send/receive only.
 * @description Enqueues HTTP requests in dynamic properties and resolves them from `bedrock-discord:*` script events.
 */
class DebuggerHttpTransport {
    /**
     * @summary Library identity sent to the debugger.
     * @description Must match what the microservice expects for this pack.
     */
    private static readonly API_NAME: string = "bedrock-discord"

    /**
     * @summary Protocol version advertised to the debugger.
     * @description Written into `bedrock-discordResponse` for handshake/discovery.
     */
    private static readonly VERSION: number = 0.6

    /**
     * @summary Dynamic-property prefix for queued requests.
     * @description Replaces Hive Mind's `hivemindRequest` prefix.
     */
    private static readonly REQUEST_PROPERTY_PREFIX: string = "bedrock-discordRequest"

    /**
     * @summary Dynamic property used for pack discovery.
     * @description Replaces Hive Mind's `hivemindResponse` property.
     */
    private static readonly RESPONSE_PROPERTY: string = "bedrock-discordResponse"

    /**
     * @summary Script-event namespace.
     * @description Replaces Hive Mind's `hivemind:` script-event prefix.
     */
    private static readonly SCRIPT_EVENT_NAMESPACE: string = "bedrock-discord"

    /**
     * @summary Default timeout in ticks.
     * @description Used when a caller does not provide a timeout.
     */
    private static readonly DEFAULT_TIMEOUT_TICKS: number = 50

    /**
     * @summary Max dynamic-property string size.
     * @description Request JSON is split into chunks at this boundary.
     */
    private static readonly CHUNK_SIZE: number = 32_767

    /**
     * @summary Whether listeners and bootstrap already ran.
     * @description Ensures script-event subscriptions are registered only once.
     */
    private static isInitialized: boolean = false

    /**
     * @summary Tick when the transport was first initialized.
     * @description Requests issued on the same tick as load are rejected.
     */
    private static loadTick: number = 0

    /**
     * @summary In-flight request resolvers.
     * @description Keyed by bridge request id.
     */
    private static readonly pendingRequests: Map<string, IPendingDebuggerRequest> = new Map()

    /**
     * @summary Buffered response chunks.
     * @description Accumulates backend payload fragments before the final success callback.
     */
    private static readonly responses: Map<string, string> = new Map()

    /**
     * @summary Private constructor.
     * @description Prevents instantiation; all members are static.
     */
    private constructor() {}

    /**
     * @summary Sends an HTTP request through the debugger bridge.
     * @description Writes a chunked request into dynamic properties and waits for the microservice response.
     * @param uri - Absolute URL to request.
     * @param init - Fetch-style method, headers, and body.
     * @param timeoutTicks - Timeout in ticks before the promise resolves as a failure.
     * @returns The response from the debugger microservice.
     */
    public static async sendHttpRequest(
        uri: string,
        init?: IDebuggerRequestInit,
        timeoutTicks: number = this.DEFAULT_TIMEOUT_TICKS,
    ): Promise<IDebuggerServerResponse> {
        this.ensureInitialized()

        return this.sendRequestAsync(
            {
                id: this.createRequestId(),
                type: DebuggerRequestType.HttpRequest,
                apiName: this.API_NAME,
                scriptEvent: true,
                data: { uri, init },
            },
            timeoutTicks,
        )
    }

    /**
     * @summary Bootstraps debugger bridge listeners.
     * @description Clears stale request properties and subscribes to `bedrock-discord:*` script events.
     */
    private static ensureInitialized(): void {
        if (this.isInitialized) {
            return
        }

        this.isInitialized = true
        this.loadTick = system.currentTick
        this.setupListeners()
        this.initSetup()
    }

    /**
     * @summary Clears stale request state and advertises this API.
     * @description Runs on the next tick so dynamic properties are safe to mutate.
     */
    private static initSetup(): void {
        system.run((): void => {
            for (const dynamicPropertyId of world
                .getDynamicPropertyIds()
                .filter((id: string): boolean => id.startsWith(this.REQUEST_PROPERTY_PREFIX))) {
                world.setDynamicProperty(dynamicPropertyId)
            }

            world.setDynamicProperty(
                this.RESPONSE_PROPERTY,
                JSON.stringify({
                    version: this.VERSION,
                    name: this.API_NAME,
                    scriptEvent: true,
                }),
            )
        })
    }

    /**
     * @summary Subscribes to bedrock-discord script events.
     * @description Handles purpose probes, response status updates, and chunked payload writes.
     */
    private static setupListeners(): void {
        system.afterEvents.scriptEventReceive.subscribe(({ id, message }): void => {
            if (id === `${this.SCRIPT_EVENT_NAMESPACE}:purpose`) {
                this.handlePurpose()
                return
            }

            if (id === `${this.SCRIPT_EVENT_NAMESPACE}:respond`) {
                this.handleRespond(message)
                return
            }

            if (id === `${this.SCRIPT_EVENT_NAMESPACE}:set`) {
                const args: string[] = message.split(" ")
                const setAction: string | undefined = args[0]
                const requestId: string | undefined = args[1]

                if (setAction === undefined || requestId === undefined) {
                    return
                }

                const rawData: string = message.slice(setAction.length + requestId.length + 2)
                this.handleSet(setAction, requestId, rawData)
            }
        })
    }

    /**
     * @summary Handles debugger purpose probes.
     * @description Re-publishes this library's identity on the discovery dynamic property.
     */
    private static handlePurpose(): void {
        world.setDynamicProperty(
            this.RESPONSE_PROPERTY,
            JSON.stringify({
                version: this.VERSION,
                name: this.API_NAME,
                scriptEvent: true,
            }),
        )
    }

    /**
     * @summary Handles debugger response status events.
     * @description Resolves or updates pending requests based on bridge status codes.
     */
    private static handleRespond(response: string): void {
        const [id, statusStr, message, data] = response.split("|")
        const status: DebuggerServerStatus = Number.parseInt(statusStr ?? "", 10) as DebuggerServerStatus
        const resolver: IPendingDebuggerRequest["callback"] | undefined = id
            ? this.pendingRequests.get(id)?.callback
            : undefined
        let requestedData: string | undefined = id === undefined ? undefined : this.responses.get(id)

        if (status === DebuggerServerStatus.Ran) {
            try {
                requestedData = JSON.parse(requestedData ?? "null") as string
                requestedData = JSON.parse(requestedData) as string
            } catch {
                // Keep the raw buffered payload when it is not double-encoded JSON.
            }

            if (resolver !== undefined && id !== undefined) {
                this.removeRequest(id)
                resolver(
                    {
                        status,
                        message: message || undefined,
                        data: requestedData ?? data,
                        getData: (): unknown => undefined,
                    },
                    false,
                )
            }

            return
        }

        if (status === DebuggerServerStatus.Failure) {
            let realRequestId: string | undefined = id

            if (!realRequestId) {
                realRequestId = Array.from(this.pendingRequests.keys()).pop()
            }

            const failureResolver: IPendingDebuggerRequest["callback"] | undefined = realRequestId
                ? this.pendingRequests.get(realRequestId)?.callback
                : undefined

            if (failureResolver !== undefined) {
                failureResolver(
                    {
                        status,
                        message: message || undefined,
                        data: data || "",
                        getData: (): unknown => undefined,
                    },
                    true,
                )
                console.warn(new Error(message))
            }

            return
        }

        if (status === DebuggerServerStatus.Running) {
            const pending: IPendingDebuggerRequest | undefined = id ? this.pendingRequests.get(id) : undefined

            if (pending !== undefined && data !== undefined) {
                const json: { totalChunks: number } = JSON.parse(data) as { totalChunks: number }
                pending.totalChunks = json.totalChunks
                pending.receivedChunks = 0
            }

            return
        }

        let parsedData: unknown

        try {
            parsedData = JSON.parse(requestedData ?? "null") as unknown
        } catch {
            parsedData = undefined
        }

        if (resolver !== undefined) {
            resolver(
                {
                    status,
                    message: message || undefined,
                    data: requestedData ?? data,
                    getData: (): unknown => parsedData,
                },
                true,
            )
        }
    }

    /**
     * @summary Handles debugger set actions.
     * @description Mutates the in-memory response buffer and request dynamic properties.
     */
    private static handleSet(setAction: string, requestId: string, rawData: string): void {
        if (setAction === DebuggerSetAction.Add) {
            const raw: string = this.responses.get(requestId) ?? ""
            this.responses.set(requestId, raw + rawData)

            const pending: IPendingDebuggerRequest | undefined = this.pendingRequests.get(requestId)

            if (pending !== undefined) {
                pending.receivedChunks = (pending.receivedChunks ?? 0) + 1
            }

            return
        }

        if (setAction === DebuggerSetAction.Remove) {
            this.removeRequest(requestId)
            return
        }

        if (setAction === DebuggerSetAction.Reset) {
            this.responses.delete(requestId)
            return
        }

        if (setAction === DebuggerSetAction.Set) {
            this.responses.set(requestId, rawData)
        }
    }

    /**
     * @summary Queues a bridge request and waits for completion.
     * @description Splits the request JSON across dynamic properties and races the backend against a tick timeout.
     * @param data - The request data.
     * @param timeoutTicks - The timeout in ticks.
     * @returns The response from the debugger microservice.
     */
    private static async sendRequestAsync(
        data: IDebuggerRequest,
        timeoutTicks: number,
    ): Promise<IDebuggerServerResponse> {
        return new Promise<IDebuggerServerResponse>((resolve, reject): void => {
            if (system.currentTick === this.loadTick) {
                reject(new Error("Debugger bridge requests cannot run on the same tick as transport initialization."))
                return
            }

            const id: string = data.id
            const chunks: string[] = this.splitString(JSON.stringify(data))
            this.addRequest(id, chunks)

            const timeout: number = system.runTimeout((): void => {
                this.removeRequest(id)
                this.pendingRequests.delete(id)
                console.warn(
                    "Timed out waiting for the bedrock-discord debugger microservice. Ensure the script debugger is connected.",
                )
                resolve({
                    status: DebuggerServerStatus.Failure,
                    message: "Timed out",
                    getData: (): unknown => undefined,
                })
            }, timeoutTicks)

            this.pendingRequests.set(id, {
                callback: (response: IDebuggerServerResponse, done?: boolean): void => {
                    system.clearRun(timeout)

                    if (done) {
                        this.pendingRequests.delete(id)
                        this.responses.delete(id)
                        resolve(response)
                    }
                },
            })
        })
    }

    /**
     * @summary Writes request chunks to dynamic properties.
     * @description Stores chunk count in `meta` and each fragment under a numeric suffix.
     * @param id - The request id.
     * @param chunks - The chunks to add.
     */
    private static addRequest(id: string, chunks: string[]): void {
        world.setDynamicProperty(`${this.REQUEST_PROPERTY_PREFIX}${id}|meta`, chunks.length)

        for (let index: number = 0; index < chunks.length; index++) {
            world.setDynamicProperty(`${this.REQUEST_PROPERTY_PREFIX}${id}|${index}`, chunks[index])
        }
    }

    /**
     * @summary Deletes request chunks from dynamic properties.
     * @description Clears both the meta entry and every numbered fragment for the request id.
     * @param id - The request id.
     */
    private static removeRequest(id: string): void {
        const chunks: number =
            (world.getDynamicProperty(`${this.REQUEST_PROPERTY_PREFIX}${id}|meta`) as number | undefined) ?? 0

        for (let index: number = 0; index < chunks; index++) {
            world.setDynamicProperty(`${this.REQUEST_PROPERTY_PREFIX}${id}|${index}`)
        }

        world.setDynamicProperty(`${this.REQUEST_PROPERTY_PREFIX}${id}|meta`)
    }

    /**
     * @summary Splits a string into dynamic-property-safe chunks.
     * @description Uses {@link CHUNK_SIZE} so Minecraft property limits are not exceeded.
     * @param value - The value to split.
     * @param size - The size of the chunks.
     * @returns The split value.
     */
    private static splitString(value: string, size: number = this.CHUNK_SIZE): string[] {
        const chunks: string[] = []

        for (let index: number = 0; index < value.length; index += size) {
            chunks.push(value.slice(index, index + size))
        }

        return chunks
    }

    /**
     * @summary Creates a unique bridge request id.
     * @description Combines the current timestamp with the library API name.
     * @returns The request id.
     */
    private static createRequestId(): string {
        return `${Date.now()}:${this.API_NAME}`
    }
}

export { DebuggerHttpTransport }
