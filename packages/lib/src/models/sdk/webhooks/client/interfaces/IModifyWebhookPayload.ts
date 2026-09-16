/**
 * @summary Payload for modifying a webhook with its token.
 * @description JSON body for `PATCH /webhooks/{webhook.id}/{webhook.token}`. Does not accept `channel_id`. All fields are optional.
 */
interface IModifyWebhookPayload {
    /**
     * @summary Default webhook name.
     * @description Replaces the webhook's display name when provided.
     */
    readonly name?: string
    /**
     * @summary Default webhook avatar.
     * @description Discord [image data](https://docs.discord.com/developers/reference#image-data) URI, or `null` to clear the avatar.
     */
    readonly avatar?: string | null
}

export type { IModifyWebhookPayload }
