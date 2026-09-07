/**
 * @summary Interface for the base response.
 * @description An object that is returned by response builders.
 * @template D - The type of the data or error.
 */
type IBaseResponse<D> = {
    /**
     * @summary The HTTP status code of the response.
     */
    readonly status: number
    /**
     * @summary The message of the response.
     * @description A short message that summarizes the response.
     * @example "INVALID_USER_AGENT_HEADER"
     */
    readonly message: string
    /**
     * @summary The timestamp of the response.
     * @description The timestamp of the response in ISO 8601 format, including timezone.
     * @example "2026-01-01T00:00:00.000Z"
     */
    readonly timestamp: string
} & (
    | {
          /**
           * @summary When the response is successful.
           * @description The response is successful and contains the data.
           */
          readonly success: true
          /**
           * @summary The data of the response.
           * @description The data of the response.
           * @remarks It's defined only when the response is successful.
           */
          readonly data: D
      }
    | {
          /**
           * @summary When the response is not successful.
           * @description The response is not successful and contains the error.
           */
          readonly success: false
          /**
           * @summary The error of the response.
           * @description The error of the response.
           * @remarks It's defined only when the response is not successful.
           */
          readonly error: D
      }
)

export type { IBaseResponse }
