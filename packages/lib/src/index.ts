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
