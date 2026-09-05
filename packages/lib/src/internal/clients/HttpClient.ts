import type { HttpHeader, HttpRequest, HttpRequestMethod, HttpResponse } from "@minecraft/server-net"
import { CommunicationMode } from "../CommunicationMode"
import { HttpMethod } from "../../models/internal/clients/http/enums/HttpMethod"
import type { IHttpPerformRequestData } from "../../models/internal/clients/http/interfaces/IHttpPerformRequestData"
import type { IRequestResponse } from "../../models/internal/clients/http/interfaces/IRequestResponse"
import { DebuggerServerStatus } from "../../models/internal/clients/debugger/enums/DebuggerServerStatus"
import type { IDebuggerServerResponse } from "../../models/internal/clients/debugger/interfaces/IDebuggerServerResponse"
import { DebuggerHttpTransport } from "./DebuggerHttpTransport"

/**
 * @summary Internal HTTP client for Discord API calls.
 * @description Uses `@minecraft/server-net` on BDS when available; otherwise the bedrock-discord debugger request bridge.
 */
class HttpClient {
    /**
     * @summary Private constructor.
     * @description Prevents instantiation and inheritance of the class.
     */
    private constructor() {}

    /**
     * @summary Performs an HTTP request.
     * @description Routes through server-net or {@link DebuggerHttpTransport} based on {@link CommunicationMode.getIsServerNetEnabled}.
     * @template D - The type of the data in a successful response.
     * @template E - The type of the error in a failed response.
     * @param method - The HTTP method to use.
     * @param url - The URL to request.
     * @param data - Optional headers, body, and timeout for the request.
     */
    private static async performRequest<D = unknown, E = unknown>(
        method: HttpMethod,
        url: string,
        data: Readonly<IHttpPerformRequestData> = {},
    ): Promise<IRequestResponse<D, E>> {
        if (await CommunicationMode.getIsServerNetEnabled()) {
            return this.performServerNetRequest(method, url, data)
        }

        return this.performDebuggerRequest(method, url, data)
    }

    /**
     * @summary Performs a request with `@minecraft/server-net`.
     * @description Builds an `HttpRequest`, executes it through the cached server-net client, and maps the result.
     */
    private static async performServerNetRequest<D = unknown, E = unknown>(
        method: HttpMethod,
        url: string,
        data: Readonly<IHttpPerformRequestData>,
    ): Promise<IRequestResponse<D, E>> {
        const serverNet: typeof import("@minecraft/server-net") = await import("@minecraft/server-net")
        const http: NonNullable<ReturnType<typeof CommunicationMode.http>> = CommunicationMode.http<true>()
        const request: HttpRequest = new serverNet.HttpRequest(url)
            .setMethod(this.toServerNetMethod(method, serverNet.HttpRequestMethod))
            .setHeaders(data.headers !== undefined ? [...data.headers] : [])

        if (data.body !== undefined) {
            request.setBody(this.serializeBody(data.body))
        }

        if (data.timeout !== undefined) {
            request.setTimeout(data.timeout)
        }

        try {
            const response: HttpResponse = await http.request(request)
            const statusCode: number = response.status
            const parsedBody: unknown = this.parseBody(response.body)

            if (statusCode >= 200 && statusCode < 300) {
                return {
                    success: true,
                    statusCode,
                    headers: response.headers,
                    data: parsedBody as D,
                }
            }

            return {
                success: false,
                statusCode,
                headers: response.headers,
                error: parsedBody as E,
            }
        } catch (error: unknown) {
            return {
                success: false,
                statusCode: 0,
                headers: [],
                error: error as E,
            }
        }
    }

    /**
     * @summary Performs a request through the debugger HTTP bridge.
     * @description Used when `@minecraft/server-net` is unavailable; requires the bedrock-discord debugger microservice.
     */
    private static async performDebuggerRequest<D = unknown, E = unknown>(
        method: HttpMethod,
        url: string,
        data: Readonly<IHttpPerformRequestData>,
    ): Promise<IRequestResponse<D, E>> {
        try {
            const response: IDebuggerServerResponse = await DebuggerHttpTransport.sendHttpRequest(
                url,
                {
                    method,
                    headers: this.toFetchHeaders(data.headers),
                    body: data.body === undefined ? undefined : this.serializeBody(data.body),
                },
                data.timeout,
            )

            if (response.status === DebuggerServerStatus.Success) {
                const parsedFromGetter: unknown = response.getData()
                const parsedBody: unknown =
                    parsedFromGetter !== undefined ? parsedFromGetter : this.parseBody(response.data ?? "")

                return {
                    success: true,
                    statusCode: 200,
                    headers: [],
                    data: parsedBody as D,
                }
            }

            return {
                success: false,
                statusCode: 0,
                headers: [],
                error: (response.message ?? response.data ?? response.status) as E,
            }
        } catch (error: unknown) {
            return {
                success: false,
                statusCode: 0,
                headers: [],
                error: error as E,
            }
        }
    }

    /**
     * @summary Sends a GET request.
     * @description Retrieves a resource from the given URL.
     * @template D - The type of the data in a successful response.
     * @template E - The type of the error in a failed response.
     * @param url - The URL to request.
     * @param headers - Optional HTTP headers for the request.
     * @param data - Optional body and timeout; headers here are merged with `headers`.
     */
    public static async get<D = unknown, E = unknown>(
        url: string,
        headers?: readonly HttpHeader[],
        data?: Readonly<IHttpPerformRequestData>,
    ): Promise<IRequestResponse<D, E>> {
        return this.performRequest(HttpMethod.Get, url, this.mergeRequestData(headers, data))
    }

    /**
     * @summary Sends a POST request.
     * @description Submits data to create or process a resource at the given URL.
     * @template D - The type of the data in a successful response.
     * @template E - The type of the error in a failed response.
     * @param url - The URL to request.
     * @param headers - Optional HTTP headers for the request.
     * @param data - Optional body and timeout; headers here are merged with `headers`.
     */
    public static async post<D = unknown, E = unknown>(
        url: string,
        headers?: readonly HttpHeader[],
        data?: Readonly<IHttpPerformRequestData>,
    ): Promise<IRequestResponse<D, E>> {
        return this.performRequest(HttpMethod.Post, url, this.mergeRequestData(headers, data))
    }

    /**
     * @summary Sends a PUT request.
     * @description Replaces a resource at the given URL.
     * @template D - The type of the data in a successful response.
     * @template E - The type of the error in a failed response.
     * @param url - The URL to request.
     * @param headers - Optional HTTP headers for the request.
     * @param data - Optional body and timeout; headers here are merged with `headers`.
     */
    public static async put<D = unknown, E = unknown>(
        url: string,
        headers?: readonly HttpHeader[],
        data?: Readonly<IHttpPerformRequestData>,
    ): Promise<IRequestResponse<D, E>> {
        return this.performRequest(HttpMethod.Put, url, this.mergeRequestData(headers, data))
    }

    /**
     * @summary Sends a DELETE request.
     * @description Removes a resource at the given URL.
     * @template D - The type of the data in a successful response.
     * @template E - The type of the error in a failed response.
     * @param url - The URL to request.
     * @param headers - Optional HTTP headers for the request.
     * @param data - Optional body and timeout; headers here are merged with `headers`.
     */
    public static async delete<D = unknown, E = unknown>(
        url: string,
        headers?: readonly HttpHeader[],
        data?: Readonly<IHttpPerformRequestData>,
    ): Promise<IRequestResponse<D, E>> {
        return this.performRequest(HttpMethod.Delete, url, this.mergeRequestData(headers, data))
    }

    /**
     * @summary Sends a PATCH request.
     * @description Applies a partial update to a resource at the given URL.
     * @template D - The type of the data in a successful response.
     * @template E - The type of the error in a failed response.
     * @param url - The URL to request.
     * @param headers - Optional HTTP headers for the request.
     * @param data - Optional body and timeout; headers here are merged with `headers`.
     */
    public static async patch<D = unknown, E = unknown>(
        url: string,
        headers?: readonly HttpHeader[],
        data?: Readonly<IHttpPerformRequestData>,
    ): Promise<IRequestResponse<D, E>> {
        return this.performRequest(HttpMethod.Patch, url, this.mergeRequestData(headers, data))
    }

    /**
     * @summary Merges caller headers into request data.
     * @description Explicit `headers` win over duplicate keys already present in `data.headers`.
     * @param headers - The headers to merge.
     * @param data - The request data.
     * @returns The merged request data.
     */
    private static mergeRequestData(
        headers?: readonly HttpHeader[],
        data?: Readonly<IHttpPerformRequestData>,
    ): Readonly<IHttpPerformRequestData> {
        if (headers === undefined || headers.length === 0) {
            return data ?? {}
        }

        const mergedHeaders: HttpHeader[] = [...(data?.headers ?? [])]
        const overriddenKeys: Set<string> = new Set(headers.map((header: HttpHeader): string => header.key))

        for (let index: number = mergedHeaders.length - 1; index >= 0; index--) {
            const existingHeader: HttpHeader | undefined = mergedHeaders[index]

            if (existingHeader !== undefined && overriddenKeys.has(existingHeader.key)) {
                mergedHeaders.splice(index, 1)
            }
        }

        mergedHeaders.push(...headers)

        return {
            ...data,
            headers: mergedHeaders,
        }
    }

    /**
     * @summary Maps library methods to server-net methods.
     * @description PATCH is cast because `@minecraft/server-net` omits it from `HttpRequestMethod` while still accepting custom verbs.
     * @param method - The HTTP method to convert.
     * @param httpRequestMethod - The `HttpRequestMethod` type from `@minecraft/server-net`.
     * @returns The converted HTTP method.
     */
    private static toServerNetMethod(
        method: HttpMethod,
        httpRequestMethod: typeof HttpRequestMethod,
    ): HttpRequestMethod {
        switch (method) {
            case HttpMethod.Get:
                return httpRequestMethod.GET
            case HttpMethod.Post:
                return httpRequestMethod.POST
            case HttpMethod.Put:
                return httpRequestMethod.PUT
            case HttpMethod.Delete:
                return httpRequestMethod.DELETE
            case HttpMethod.Head:
                return httpRequestMethod.HEAD
            case HttpMethod.Patch:
                return "PATCH" as HttpRequestMethod
        }
    }

    /**
     * @summary Converts server-net headers to fetch headers.
     * @description Produces a plain header map for the debugger bridge init payload.
     * @param headers - The headers to convert.
     * @returns The converted headers.
     */
    private static toFetchHeaders(headers?: readonly HttpHeader[]): Record<string, string> | undefined {
        if (headers === undefined || headers.length === 0) {
            return undefined
        }

        const result: Record<string, string> = {}

        for (const header of headers) {
            result[header.key] = String(header.value)
        }

        return result
    }

    /**
     * @summary Serializes a request body.
     * @description Strings are sent as-is; other values are JSON-encoded.
     * @param body - The body to serialize.
     * @returns The serialized body.
     */
    private static serializeBody(body: unknown): string {
        if (typeof body === "string") {
            return body
        }

        return JSON.stringify(body)
    }

    /**
     * @summary Parses a response body.
     * @description Attempts JSON parsing and falls back to the raw string when parsing fails.
     * @param body - The body to parse.
     * @returns The parsed body.
     */
    private static parseBody(body: string): unknown {
        if (body.length === 0) {
            return undefined
        }

        try {
            return JSON.parse(body) as unknown
        } catch {
            return body
        }
    }
}

export { HttpClient }
