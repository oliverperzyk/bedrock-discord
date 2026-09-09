import type { IPartialChannel } from "../../../channels/base/interfaces/IPartialChannel"
import type { Snowflake } from "../../../data/snowflakes/types/Snowflake"
import type { IPartialGuild } from "../../../guilds/base/interfaces/IPartialGuild"
import type { WebhookType } from "../enums/WebhookType"

/**
 * @summary A webhook object.
 * @description A webhook object is a webhook that is used to send messages to a channel.
 */
type IWebhook = {
    /**
     * @summary Identifier of a webhook.
     * @description Unique identifier for the webhook.
     */
    readonly id: Snowflake
    /**
     * @summary Type of the webhook.
     * @description Type of a webhook, that might be originated with additional fields.
     */
    readonly type: WebhookType.APPLICATION
    /**
     * @summary Identifier of the guild.
     * @description Snowflake of the guild the webhook is associated with.
     */
    readonly guildId?: Snowflake
    /**
     * @summary Identifier of the channel.
     * @description Snowflake of the channel the webhook is associated with.
     */
    readonly channelId?: Snowflake
    /**
     * @summary Name of the webhook.
     * @description Raw name of the webhook.
     */
    readonly name?: string
    /**
     * @summary Avatar hash of the webhook.
     * @description CDN hash of the webhook's default avatar.
     */
    readonly avatar?: string
} & (
    | {
          /**
           * @summary Type of the webhook.
           * @description Type of the webhook.
           */
          readonly type: WebhookType.INCOMING
          /**
           * @summary Token of the webhook.
           * @description Token of the webhook, only available for Incoming Webhooks.
           */
          readonly token?: string
      }
    | {
          /**
           * @summary Type of the webhook.
           * @description Type of the webhook.
           */
          readonly type: WebhookType.CHANNEL_FOLLOWER
          /**
           * @summary Source guild.
           * @description Source guild of the webhook.
           */
          readonly sourceGuild: IPartialGuild
          /**
           * @summary Source channel.
           * @description Source channel of the webhook.
           */
          readonly sourceChannel: IPartialChannel
      }
)

export type { IWebhook }
