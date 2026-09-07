import { BaseResponseBuilder } from "../base/BaseResponseBuilder"
import type { IBaseResponseMessage } from "../base/IBaseResponseMessage"

/**
 * @summary Builder for the not acceptable response.
 * @description Builds a response object for a not acceptable request.
 */
class NotAcceptableResponseBuilder extends BaseResponseBuilder {
    /**
     * @summary Protected constructor.
     * @description Prevents instantiation of the class.
     */
    protected constructor() {
        super()
    }

    /**
     * @summary The HTTP status code of the response.
     */
    public override readonly HTTP_STATUS_CODE: number = 406

    /**
     * @summary Whether the response represents a successful operation.
     */
    public override readonly IS_SUCCESSFUL: boolean = false

    /**
     * @summary Builds a response object for a not acceptable request due to an invalid Accept header.
     * @description Returns a response object with the message "ACCEPT_HEADER_NOT_ACCEPTABLE" that is sent when the Accept header does not include JSON responses.
     * @returns The built response object.
     */
    public static get acceptHeaderNotAcceptable(): IBaseResponseMessage {
        return BaseResponseBuilder.build("ACCEPT_HEADER_NOT_ACCEPTABLE", {
            message: "The request header 'Accept' is not acceptable, as API only returns JSON responses.",
        })
    }
}

export { NotAcceptableResponseBuilder }
