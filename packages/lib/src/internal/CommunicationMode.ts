import type { http } from "@minecraft/server-net"

/**
 * @summary Represents the communication mode of the server.
 * @description Detects whether `@minecraft/server-net` is available and caches its HTTP client for BDS requests.
 */
class CommunicationMode {
    /**
     * @summary Private constructor.
     * @description Prevents instantiation and inheritance.
     */
    private constructor() {}

    /**
     * @summary Cached server-net availability.
     * @description `null` until the first probe; then `true` when `@minecraft/server-net` loads successfully.
     */
    private static IS_SERVER_NET_ENABLED: boolean | null = null

    /**
     * @summary Cached server-net HTTP client.
     * @description Set when {@link getIsServerNetEnabled} successfully imports `@minecraft/server-net`.
     */
    private static CACHED_HTTP_VARIABLE: typeof http | null = null

    /**
     * @summary Whether server-net is available.
     * @description Probes `@minecraft/server-net` once and reuses the result for later requests.
     */
    public static async getIsServerNetEnabled(): Promise<boolean> {
        if (this.IS_SERVER_NET_ENABLED === null) {
            try {
                const { http: dynamicHttp } = await import("@minecraft/server-net")
                this.CACHED_HTTP_VARIABLE = dynamicHttp
                this.IS_SERVER_NET_ENABLED = true
            } catch {
                this.IS_SERVER_NET_ENABLED = false
            }
        }

        return this.IS_SERVER_NET_ENABLED
    }

    /**
     * @summary Gets the cached server-net HTTP client.
     * @description Call {@link getIsServerNetEnabled} first; returns `null` when server-net is unavailable.
     * @template T - When `true`, asserts that the HTTP client has already been cached.
     * @returns The HTTP client.
     * @example
     * ```ts
     * // Get the HTTP client with type assertion to force the type to be `typeof http`.
     * const http = CommunicationMode.http<true>()
     *
     * // Get the HTTP client with type assertion to force the type to be `typeof http | null`.
     * const mightBeHttp = CommunicationMode.http<false>()
     * ```
     */
    public static http<T extends boolean = false>(): T extends true ? typeof http : typeof http | null {
        return this.CACHED_HTTP_VARIABLE as T extends true ? typeof http : typeof http | null
    }
}

export { CommunicationMode }
