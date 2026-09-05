import type { HttpHeader } from "@minecraft/server-net"

/**
 * @summary Represents a response from an HTTP request.
 * @description A wrapper around the response from an HTTP request.
 * @template D - The type of the data in the response.
 * @template E - The type of the error in the response.
 */
type IRequestResponse<D = unknown, E = unknown> = {
    /**
     * @summary The status code of the response.
     * @description HTTP status code of the response.
     */
    readonly statusCode: number
    /**
     * @summary The headers of the response.
     * @description HTTP headers of the response.
     */
    readonly headers: HttpHeader[]
} & (
    | {
          /**
           * @summary Whether the request was successful.
           * @description If it's true, the request was successful and the data is available.
           */
          readonly success: true
          /**
           * @summary The data of the response.
           * @description The data of the response.
           */
          readonly data: D
      }
    | {
          /**
           * @summary Whether the request was successful.
           * @description If it's false, the request was not successful and the error is available.
           */
          readonly success: false
          /**
           * @summary The error of the response.
           * @description The error of the response.
           */
          readonly error: E
      }
)

export type { IRequestResponse }
