# Bedrock Discord - a library for Script API in Bedrock Add-ons

Point of this library/extension is to allow developers to connect with Discord API, such as sending webhook messages, fetching Discord channels, etc. directly from add-ons.

## Sources of truth

When implementing or changing Discord-related behavior, treat these as authoritative:

- Discord API reference, especially the Gateway (WebSocket) API: https://docs.discord.com/developers/reference#gateway-websocket-api
- [discord.js](https://discord.js.org/) for API shapes, naming, and usage patterns

Prefer aligning models and client behavior with those sources over inventing parallel conventions.

## Type placement

Do **not** declare `enum`, `interface`, or `type` aliases outside `src/models`.

- Put shared Discord/resource shapes and related type-only definitions under `src/models`.
- Create that directory when adding types if it does not exist yet.
- Implementation files elsewhere must import from `src/models`; they must not grow local public type definitions.
- Each interface, enumeration & type should be in a separate file.

## JSDoc documentation

Document symbols with JSDoc in the style already used in this package.

- Every documented symbol needs both `@summary` and `@description`.
- `@description` must **not** repeat `@summary`. It should add more context (role, behavior, constraints).
- Public classes outside `src/internal` must include `@example` showing basic usage of the class.
- Classes and modules under `src/internal` do not require `@example` (internal transport plumbing, not consumer API).

## `src/internal`

`src/internal` holds the transport/request layer that lets the pack send HTTP requests from:

- **BDS** with `@minecraft/server-net` enabled (direct HTTP via `HttpClient` / `CommunicationMode`)
- **Script debugger bridge** when server-net is unavailable (`DebuggerHttpTransport`): send/receive only — requests are queued in `bedrock-discordRequest*` dynamic properties and completed through `bedrock-discord:respond` / `bedrock-discord:set` / `bedrock-discord:purpose` script events for the library’s own debugger/API microservice

Treat that directory as environment-bridging internals, not as the public Discord surface. Do not couple to third-party Hive Mind servers; the wire protocol is inspired by that pattern but uses `bedrock-discord` prefixes. There is no multi-world sync.
