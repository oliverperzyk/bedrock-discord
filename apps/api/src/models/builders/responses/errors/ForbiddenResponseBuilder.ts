import { BaseResponseBuilder } from "../base/BaseResponseBuilder"
import type { IBaseResponse } from "../base/IBaseResponse"

/**
 * @summary Builder for the forbidden response.
 * @description Builds a response object for a forbidden request.
 */
class ForbiddenResponseBuilder extends BaseResponseBuilder {
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
    public override readonly HTTP_STATUS_CODE: number = 403

    /**
     * @summary Whether the response represents a successful operation.
     */
    public override readonly IS_SUCCESSFUL: boolean = false

    /**
     * @summary Builds a response object for a forbidden request due to an invalid User-Agent header.
     * @description Returns a response object with the message "INVALID_USER_AGENT_HEADER" that is sent when the User-Agent header is not "Bedrock-Discord".
     * @returns The built response object.
     */
    public static get forbiddenInvalidUserAgentHeader(): IBaseResponse<undefined> {
        return BaseResponseBuilder.build("INVALID_USER_AGENT_HEADER", undefined)
    }
}

export { ForbiddenResponseBuilder }
