import type { Snowflake } from "../../src/models/sdk/data/snowflakes/types/Snowflake"
import type { ISticker } from "../../src/models/sdk/stickers/base/interfaces/ISticker"
import { StickerType } from "../../src/models/sdk/stickers/base/enums/StickerType"
import { StickerFormatType } from "../../src/models/sdk/stickers/base/enums/StickerFormatType"

export const { HttpClient } = await import("../../src/internal/clients/HttpClient")
export const stickerId = "749054660769218631" as Snowflake
export const guildId = "847199849233514548" as Snowflake
export const packId = "847199849233514549" as Snowflake
export const stickerData: ISticker = {
    id: stickerId,
    pack_id: packId,
    name: "Wave",
    description: null,
    tags: "hello,wave",
    type: StickerType.STANDARD,
    format_type: StickerFormatType.APNG,
    sort_value: 12,
}
