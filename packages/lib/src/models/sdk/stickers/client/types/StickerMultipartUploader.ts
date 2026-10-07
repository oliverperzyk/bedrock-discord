import type { IRequestResponse } from "../../../../internal/clients/http/interfaces/IRequestResponse"
import type { ISticker } from "../../base/interfaces/ISticker"
import type { IStickerMultipartRequest } from "../interfaces/IStickerMultipartRequest"

/**
 * @summary Multipart upload transport.
 * @description Executes the supplied binary upload request and returns the created sticker or a failed HTTP response envelope.
 */
type StickerMultipartUploader = (request: IStickerMultipartRequest) => Promise<IRequestResponse<ISticker>>

export type { StickerMultipartUploader }
