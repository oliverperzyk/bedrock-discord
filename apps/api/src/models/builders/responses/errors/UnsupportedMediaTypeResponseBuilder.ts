import { BaseResponseBuilder } from "../base/BaseResponseBuilder"
import type { IBaseResponseMessage } from "../base/IBaseResponseMessage"

/**
 * @summary Builder for the unsupported media type response.
 * @description Builds a response object for a unsupported media type request.
 */
class UnsupportedMediaTypeResponseBuilder extends BaseResponseBuilder {
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
    public override readonly HTTP_STATUS_CODE: number = 415

    /**
     * @summary Whether the response represents a successful operation.
     */
    public override readonly IS_SUCCESSFUL: boolean = false

    /**
     * @summary Builds a response object for a unsupported media type request due to an invalid Content-Type header.
     * @description Returns a response object with the message "CONTENT_TYPE_NOT_SUPPORTED" that is sent when the Content-Type header is not supported.
     * @returns The built response object.
     */
    public static get contentTypeNotSupported(): IBaseResponseMessage {
        return BaseResponseBuilder.build("CONTENT_TYPE_NOT_SUPPORTED", {
            message: "The request header 'Content-Type' is not supported, as API only supports JSON responses.",
        })
    }
}

export { UnsupportedMediaTypeResponseBuilder }
