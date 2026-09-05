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
