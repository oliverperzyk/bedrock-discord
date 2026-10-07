/**
 * @name bedrock-discord
 * @description An easy way to interact with Discord API via Bedrock Add-ons.
 * @author oliverperzyk (Oliwier Perzyński) <olek@oliverperzyk.com>
 * @host https://bedrock-discord.oliverperzyk.com
 * @license MIT
 */

/**
 * @summary Internal stuff that must be bundled with the library,
 * so the library can send HTTP on BDS (server-net) or via the debugger bridge on worlds.
 */
export { HttpClient } from "./internal/clients/HttpClient"

/**
 * @summary SDK related with webhooks.
 */
export * from "./sdk/webhooks/Webhook"

/**
 * @summary SDK related for components.
 */
export * from "./sdk/builders/components"

/**
 * @summary SDK related for message polls.
 */
export * from "./sdk/builders/message"

/**
 * @summary SDK sticker resources and authentication.
 * @description Public models and REST operations for Discord stickers.
 */
export { DiscordRestClient } from "./sdk/client/DiscordRestClient"
export { Sticker } from "./sdk/stickers/Sticker"
export { StickerType } from "./models/sdk/stickers/base/enums/StickerType"
export { StickerFormatType } from "./models/sdk/stickers/base/enums/StickerFormatType"
export type { ISticker } from "./models/sdk/stickers/base/interfaces/ISticker"
export type { IStickerUser } from "./models/sdk/stickers/base/interfaces/IStickerUser"
export type { IStickerFetchOptions } from "./models/sdk/stickers/client/interfaces/IStickerFetchOptions"
export { StickerPack } from "./sdk/stickers/StickerPack"
export type { IStickerPack } from "./models/sdk/stickers/base/interfaces/IStickerPack"
export type { IStickerPacksResponse } from "./models/sdk/stickers/client/interfaces/IStickerPacksResponse"
export { GuildStickerManager } from "./sdk/stickers/GuildStickerManager"
export type { IGuildStickerCreateOptions } from "./models/sdk/stickers/client/interfaces/IGuildStickerCreateOptions"
export type { IGuildStickerEditOptions } from "./models/sdk/stickers/client/interfaces/IGuildStickerEditOptions"
export type { IStickerFile } from "./models/sdk/stickers/client/interfaces/IStickerFile"
export type { IStickerMultipartRequest } from "./models/sdk/stickers/client/interfaces/IStickerMultipartRequest"
export type { StickerContentType } from "./models/sdk/stickers/client/types/StickerContentType"
export type { StickerMultipartUploader } from "./models/sdk/stickers/client/types/StickerMultipartUploader"

/**
 * @summary SDK emoji resources.
 * @description Public emoji snapshots and shared REST fetch controls.
 */
export { Emoji } from "./sdk/emojis/Emoji"
export type { IEmoji } from "./models/sdk/emojis/base/interfaces/IEmoji"
export type { IPartialEmoji } from "./models/sdk/emojis/base/interfaces/IPartialEmoji"
export type { IEmojiUser } from "./models/sdk/emojis/base/interfaces/IEmojiUser"
export type { IResourceFetchOptions } from "./models/sdk/client/interfaces/IResourceFetchOptions"
export { ApplicationEmoji } from "./sdk/emojis/ApplicationEmoji"
export type { IApplicationEmoji } from "./models/sdk/emojis/base/interfaces/IApplicationEmoji"
export type { IApplicationEmojiEditOptions } from "./models/sdk/emojis/client/interfaces/IApplicationEmojiEditOptions"
export { GuildEmojiManager } from "./sdk/emojis/managers/GuildEmojiManager"
export type { IGuildEmojiCreateOptions } from "./models/sdk/emojis/client/interfaces/IGuildEmojiCreateOptions"
export type { IGuildEmojiEditOptions } from "./models/sdk/emojis/client/interfaces/IGuildEmojiEditOptions"
