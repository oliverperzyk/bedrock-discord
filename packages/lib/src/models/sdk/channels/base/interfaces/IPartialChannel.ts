import type { Snowflake } from "../../../data/snowflakes/types/Snowflake"
import type { ChannelType } from "../enums/ChannelType"

/**
 * @summary A partial Discord channel.
 * @description A reduced channel payload used where Discord does not send the full channel object (invites, message mentions, webhook `source_channel`, and interaction `resolved` data). Only `id` is always present; other fields depend on the endpoint.
 */
interface IPartialChannel {
    /**
     * @summary Channel id.
     * @description Snowflake of the channel.
     */
    readonly id: Snowflake
    /**
     * @summary Channel type.
     * @description Discriminator for the kind of channel. Omitted on some partial payloads such as webhook `source_channel`.
     */
    readonly type?: ChannelType
    /**
     * @summary Channel name.
     * @description 1–100 characters, or `null` when Discord does not expose a name (for example some DM payloads).
     */
    readonly name?: string | null
    /**
     * @summary Guild id.
     * @description Snowflake of the guild this channel belongs to, included on mention and some invite partials.
     */
    readonly guildId?: Snowflake
    /**
     * @summary Parent id.
     * @description Category id for guild channels, or the parent text channel id for threads, when included.
     */
    readonly parentId?: Snowflake | null
    /**
     * @summary Computed permissions.
     * @description Permission bitfield for the invoking user, including overwrites, only present on interaction `resolved` channel data.
     */
    readonly permissions?: string
    /**
     * @summary Group DM icon.
     * @description Icon hash for a group DM, when this partial represents that channel on an invite.
     */
    readonly icon?: string | null
}

export type { IPartialChannel }
