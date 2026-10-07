import type { Snowflake } from "../../src/models/sdk/data/snowflakes/types/Snowflake"
import type { IEmoji } from "../../src/models/sdk/emojis/base/interfaces/IEmoji"
export { HttpClient } from "../../src/internal/clients/HttpClient"
export const emojiId = "41771983429993937" as Snowflake
export const guildId = "847199849233514548" as Snowflake
export const applicationId = "847199849233514547" as Snowflake
export const image = "data:image/png;base64,AQ=="
export const emojiData: IEmoji = {
    id: emojiId,
    name: "Wave",
    roles: [],
    require_colons: true,
    managed: false,
    animated: false,
    available: true,
    user: { id: emojiId, username: "Uploader", discriminator: "0", avatar: null, public_flags: 131328 },
}
