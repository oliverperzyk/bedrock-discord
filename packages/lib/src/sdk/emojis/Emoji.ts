import type { Snowflake } from "../../models/sdk/data/snowflakes/types/Snowflake"
import type { IEmoji } from "../../models/sdk/emojis/base/interfaces/IEmoji"
import type { IEmojiUser } from "../../models/sdk/emojis/base/interfaces/IEmojiUser"
import { DiscordRestClient } from "../client/DiscordRestClient"

/**
 * @summary Represents a Discord emoji.
 * @description Readonly resource snapshot for Unicode and custom emojis; guild API operations belong to GuildEmojiManager.
 * @example
 * ```ts
 * const emoji = new Emoji(client, { id: null, name: "🔥" })
 * console.warn(`Hello ${emoji}`)
 * ```
 */
class Emoji {
    /**
     * @summary Creates an emoji snapshot.
     * @description Preserves wire data and optional guild context without sending a request.
     * @param client - Shared authenticated REST client.
     * @param data - Discord emoji payload.
     * @param guildId - Owning guild when known.
     */
    public constructor(
        public readonly client: DiscordRestClient,
        protected readonly data: IEmoji,
        public readonly guildId?: Snowflake,
    ) {}

    /**
     * @summary Emoji identifier.
     * @description Null for Unicode emoji.
     */
    public get id(): Snowflake | null {
        return this.data.id
    }

    /**
     * @summary Display name.
     * @description Null when reaction data is unavailable.
     */
    public get name(): string | null {
        return this.data.name
    }

    /**
     * @summary Allowed roles.
     * @description Guild permissions supplied by Discord.
     */
    public get roles(): readonly Snowflake[] | undefined {
        return this.data.roles
    }

    /**
     * @summary Uploader.
     * @description Public user wire data when the endpoint includes it.
     */
    public get user(): IEmojiUser | undefined {
        return this.data.user
    }

    /**
     * @summary Colon requirement.
     * @description Whether this custom emoji name must be surrounded by colons.
     */
    public get requiresColons(): boolean | undefined {
        return this.data.require_colons
    }

    /**
     * @summary Integration management.
     * @description Whether an external integration manages the emoji.
     */
    public get managed(): boolean | undefined {
        return this.data.managed
    }

    /**
     * @summary Animation flag.
     * @description Whether the asset contains animation.
     */
    public get animated(): boolean | undefined {
        return this.data.animated
    }

    /**
     * @summary Availability.
     * @description Whether the guild emoji is currently usable.
     */
    public get available(): boolean | undefined {
        return this.data.available
    }

    /**
     * @summary Serializes this emoji.
     * @description Returns a wire-format copy without the REST client or guild context.
     * @returns Discord emoji payload.
     */
    public toJSON(): IEmoji {
        return {
            ...this.data,
            ...(this.data.roles === undefined ? {} : { roles: [...this.data.roles] }),
            ...(this.data.user === undefined ? {} : { user: { ...this.data.user } }),
        }
    }

    /**
     * @summary Formats this emoji for a message.
     * @description Returns Unicode text or Discord custom emoji markup; an unavailable custom name uses an underscore placeholder.
     * @returns Message-ready emoji text.
     */
    public toString(): string {
        if (this.id === null) return this.name ?? ""
        return `<${this.animated ? "a" : ""}:${this.name ?? "_"}:${this.id}>`
    }
}

export { Emoji }
