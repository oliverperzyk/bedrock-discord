import type { Snowflake } from "../../../data/snowflakes/types/Snowflake"

/**
 * @summary Minimal Discord message object.
 * @description Typed subset of fields returned by webhook message endpoints. Additional Discord message properties may be present at runtime without being modeled here yet.
 */
interface IMessage {
    /**
     * @summary Message id.
     * @description Snowflake of the message.
     */
    readonly id: Snowflake
    /**
     * @summary Channel id.
     * @description Snowflake of the channel the message was sent in.
     */
    readonly channelId: Snowflake
    /**
     * @summary Message text.
     * @description Contents of the message, when present.
     */
    readonly content?: string
    /**
     * @summary Embed objects.
     * @description Rich embeds attached to the message.
     */
    readonly embeds?: ReadonlyArray<Record<string, unknown>>
    /**
     * @summary Message components.
     * @description Layout and interactive components on the message.
     */
    readonly components?: ReadonlyArray<Record<string, unknown>>
    /**
     * @summary Message flags bitfield.
     * @description Combined message flags as an integer.
     */
    readonly flags?: number
    /**
     * @summary Attachments.
     * @description File attachments on the message.
     */
    readonly attachments?: ReadonlyArray<Record<string, unknown>>
}

export type { IMessage }
