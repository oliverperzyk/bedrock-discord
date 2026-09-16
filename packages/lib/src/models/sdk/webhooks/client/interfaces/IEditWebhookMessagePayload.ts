import type { BaseComponent } from "../../../../../sdk/components/base/BaseComponent"

/**
 * @summary JSON body for editing a webhook message.
 * @description Payload for `PATCH /webhooks/{webhook.id}/{webhook.token}/messages/{message.id}`. Every field is optional and nullable. File uploads (`files[n]` / `payload_json`) are not supported here; use attachment metadata only to keep or drop existing files.
 */
interface IEditWebhookMessagePayload {
    /**
     * @summary Message text.
     * @description Up to 2000 characters, or `null` to clear when allowed.
     */
    readonly content?: string | null
    /**
     * @summary Embed objects.
     * @description Up to 10 rich embeds as plain JSON objects until an Embed builder exists.
     */
    readonly embeds?: ReadonlyArray<Record<string, unknown>> | null
    /**
     * @summary Message flags bitfield.
     * @description Discord allows `SUPPRESS_EMBEDS` and `IS_COMPONENTS_V2` on this endpoint.
     */
    readonly flags?: number | null
    /**
     * @summary Allowed mentions.
     * @description Plain allowed-mentions object until a dedicated builder exists.
     */
    readonly allowedMentions?: Record<string, unknown> | null
    /**
     * @summary Message components.
     * @description Component builders serialized with `toJSON()`, or `null` to clear when allowed.
     */
    readonly components?: ReadonlyArray<BaseComponent> | null
    /**
     * @summary Attachment metadata.
     * @description Partial attachment objects listing files to keep after the edit. Does not upload new file bytes.
     */
    readonly attachments?: ReadonlyArray<Record<string, unknown>> | null
    /**
     * @summary Poll object.
     * @description Plain poll create request until a Poll builder exists. Discord only allows adding polls when editing deferred interaction responses.
     */
    readonly poll?: Record<string, unknown> | null
}

export type { IEditWebhookMessagePayload }
