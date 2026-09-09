/**
 * @summary Discord channel type.
 * @description Discriminator for guild, DM, thread, and other channel kinds returned on channel objects.
 */
enum ChannelType {
    /**
     * @summary Guild text channel.
     * @description A text channel within a server.
     */
    GUILD_TEXT = 0,
    /**
     * @summary Direct message.
     * @description A direct message between two users.
     */
    DM = 1,
    /**
     * @summary Guild voice channel.
     * @description A voice channel within a server.
     */
    GUILD_VOICE = 2,
    /**
     * @summary Group DM.
     * @description A direct message between multiple users.
     */
    GROUP_DM = 3,
    /**
     * @summary Channel category.
     * @description An organizational category that can contain up to 50 channels.
     */
    GUILD_CATEGORY = 4,
    /**
     * @summary Announcement channel.
     * @description A channel users can follow and crosspost into their own server.
     */
    GUILD_ANNOUNCEMENT = 5,
    /**
     * @summary Announcement thread.
     * @description A temporary sub-channel within a guild announcement channel. Available in API v9 and above.
     */
    ANNOUNCEMENT_THREAD = 10,
    /**
     * @summary Public thread.
     * @description A temporary sub-channel within a guild text or forum channel. Available in API v9 and above.
     */
    PUBLIC_THREAD = 11,
    /**
     * @summary Private thread.
     * @description A temporary sub-channel within a guild text channel, visible only to invitees and members with `MANAGE_THREADS`. Available in API v9 and above.
     */
    PRIVATE_THREAD = 12,
    /**
     * @summary Stage voice channel.
     * @description A voice channel for hosting events with an audience.
     */
    GUILD_STAGE_VOICE = 13,
    /**
     * @summary Hub directory channel.
     * @description A channel in a Student Hub that lists servers.
     */
    GUILD_DIRECTORY = 14,
    /**
     * @summary Forum channel.
     * @description A channel that can only contain threads.
     */
    GUILD_FORUM = 15,
    /**
     * @summary Media channel.
     * @description A channel that can only contain threads, similar to a forum channel.
     */
    GUILD_MEDIA = 16,
}

export { ChannelType }
