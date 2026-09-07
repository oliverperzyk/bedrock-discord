import type { IBaseResponse } from "./IBaseResponse"

/**
 * @summary Interface for the base response message.
 * @description An object that is returned by response builders with a message.
 */
type IBaseResponseMessage = IBaseResponse<
    Readonly<{
        readonly message: string
    }>
>

export type { IBaseResponseMessage }
