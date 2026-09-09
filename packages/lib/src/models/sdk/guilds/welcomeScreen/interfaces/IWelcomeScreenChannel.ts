import type { Snowflake } from "../../../data/snowflakes/types/Snowflake"

/**
 * @summary A channel shown on a guild welcome screen.
 * @description One of up to five channels listed to new members, with optional emoji metadata.
 */
interface IWelcomeScreenChannel {
    /**
     * @summary Channel id.
     * @description Snowflake of the channel advertised on the welcome screen.
     */
    readonly channelId: Snowflake
    /**
     * @summary Channel description.
     * @description Text shown next to the channel on the welcome screen.
     */
    readonly description: string
    /**
     * @summary Custom emoji id.
     * @description Snowflake of the custom emoji, or `null` when a unicode emoji or no emoji is used.
     */
    readonly emojiId: Snowflake | null
    /**
     * @summary Emoji name.
     * @description Custom emoji name, unicode character, or `null` when no emoji is set.
     */
    readonly emojiName: string | null
}

export type { IWelcomeScreenChannel }
