import { afterEach, expect, mock, spyOn, test } from "bun:test"
import { GuildEmojiManager } from "../../src/sdk/emojis/managers/GuildEmojiManager"
import { ApplicationEmoji } from "../../src/sdk/emojis/ApplicationEmoji"
import { Emoji } from "../../src/sdk/emojis/Emoji"
import { DiscordRestClient } from "../../src/sdk/client/DiscordRestClient"
import type { Snowflake } from "../../src/models/sdk/data/snowflakes/types/Snowflake"
import type { IEmoji } from "../../src/models/sdk/emojis/base/interfaces/IEmoji"
import type { IRequestResponse } from "../../src/models/internal/clients/http/interfaces/IRequestResponse"
import { HttpClient, emojiData, emojiId, guildId, applicationId, image } from "./fixtures"

const success: IRequestResponse<IEmoji> = { success: true, statusCode: 200, headers: [], data: emojiData }
const collection = `https://discord.com/api/v10/guilds/${guildId}/emojis`
const item = `${collection}/${emojiId}`
const reason = "Rename / greeting 🐱"
afterEach(() => mock.restore())

test("guild listing and item GET hydrate scope, missing users and unavailable flags", async () => {
    const get = spyOn(HttpClient, "get").mockResolvedValue({
        ...success,
        data: [{ ...emojiData, user: undefined, available: false }],
    })
    const manager = new GuildEmojiManager(new DiscordRestClient().setToken("token"), guildId)
    const emojis = await manager.fetch()
    expect(emojis?.[0]).toBeInstanceOf(Emoji)
    expect(emojis?.[0]?.guildId).toBe(guildId)
    expect(emojis?.[0]?.user).toBeUndefined()
    expect(emojis?.[0]?.available).toBe(false)
    expect(get).toHaveBeenCalledWith(collection, [{ key: "Authorization", value: "Bot token" }], { body: undefined })
    get.mockResolvedValue(success)
    const emoji = await manager.fetch(emojiId)
    expect(emoji?.id).toBe(emojiId)
    expect(get.mock.calls[1]?.[0]).toBe(item)
    expect(await manager.fetch(emojiId)).toBe(emoji)
    expect(await manager.fetch()).toBe(emojis)
})

test("guild create POSTs image and defaults roles; guild mutations encode reasons", async () => {
    const post = spyOn(HttpClient, "post").mockResolvedValue(success)
    const manager = new GuildEmojiManager(new DiscordRestClient().setToken("token"), guildId)
    const emoji = await manager.create({ name: "Wave", image, reason })
    expect(emoji?.guildId).toBe(guildId)
    expect(post).toHaveBeenCalledWith(
        collection,
        [
            { key: "Authorization", value: "Bot token" },
            { key: "X-Audit-Log-Reason", value: encodeURIComponent(reason) },
            { key: "Content-Type", value: "application/json" },
        ],
        { body: { name: "Wave", image, roles: [] } },
    )
    await manager.create({ name: "Wave", image, roles: [guildId] })
    expect(post.mock.calls[1]?.[2]?.body).toEqual({ name: "Wave", image, roles: [guildId] })
})

test("guild edit preserves omitted, null and empty roles and keeps audit reason outside JSON", async () => {
    const patch = spyOn(HttpClient, "patch").mockResolvedValue(success)
    const client = new DiscordRestClient().setToken("token")
    const manager = new GuildEmojiManager(client, guildId)
    await manager.edit(new Emoji(client, emojiData, guildId), { name: "Hello", reason })
    expect(patch).toHaveBeenCalledWith(
        item,
        [
            { key: "Authorization", value: "Bot token" },
            { key: "X-Audit-Log-Reason", value: encodeURIComponent(reason) },
            { key: "Content-Type", value: "application/json" },
        ],
        { body: { name: "Hello" } },
    )
    await manager.edit(emojiId, { roles: null })
    await manager.edit(emojiId, { roles: [] })
    await manager.edit(emojiId, { roles: [guildId] })
    await manager.edit(emojiId)
    expect(patch.mock.calls.slice(1).map((call) => call[2]?.body)).toEqual([
        { roles: null },
        { roles: [] },
        { roles: [guildId] },
        {},
    ])
})

test("guild DELETE handles empty 204 and sends the encoded audit reason", async () => {
    const remove = spyOn(HttpClient, "delete").mockResolvedValue({
        success: true,
        statusCode: 204,
        headers: [],
        data: undefined,
    })
    const client = new DiscordRestClient().setToken("token")
    const manager = new GuildEmojiManager(client, guildId)
    expect(await manager.delete(new Emoji(client, emojiData, guildId), reason)).toBe(true)
    expect(remove).toHaveBeenCalledWith(
        item,
        [
            { key: "Authorization", value: "Bot token" },
            { key: "X-Audit-Log-Reason", value: encodeURIComponent(reason) },
        ],
        { body: undefined },
    )
})

test("all guild mutations invalidate shared item/list caches while other owners and clients remain cached", async () => {
    const get = spyOn(HttpClient, "get").mockResolvedValue(success)
    spyOn(HttpClient, "post").mockResolvedValue(success)
    spyOn(HttpClient, "patch").mockResolvedValue(success)
    spyOn(HttpClient, "delete").mockResolvedValue({ success: true, statusCode: 204, headers: [], data: undefined })
    const client = new DiscordRestClient().setToken("token")
    const manager = new GuildEmojiManager(client, guildId)
    const same = new GuildEmojiManager(client, guildId)
    const otherOwner = new GuildEmojiManager(client, applicationId)
    const otherClient = new GuildEmojiManager(new DiscordRestClient().setToken("other"), guildId)
    const ownerCached = await otherOwner.fetch(emojiId)
    const clientCached = await otherClient.fetch(emojiId)
    for (const mutate of [
        () => manager.create({ name: "Wave", image }),
        () => manager.edit(emojiId, { roles: null }),
        () => manager.delete(emojiId),
    ]) {
        get.mockResolvedValue(success)
        await manager.fetch(emojiId)
        get.mockResolvedValue({ ...success, data: [emojiData] })
        await manager.fetch()
        const count = get.mock.calls.length
        await mutate()
        get.mockResolvedValue(success)
        await same.fetch(emojiId)
        get.mockResolvedValue({ ...success, data: [] })
        expect(await same.fetch()).toEqual([])
        expect(get.mock.calls.length).toBe(count + 2)
        expect(await otherOwner.fetch(emojiId)).toBe(ownerCached)
        expect(await otherClient.fetch(emojiId)).toBe(clientCached)
    }
})

test("force and cache=false preserve fetch controls for both guild overloads", async () => {
    const get = spyOn(HttpClient, "get").mockResolvedValue(success)
    const client = new DiscordRestClient().setToken("first")
    const manager = new GuildEmojiManager(client, guildId)
    const original = await manager.fetch(emojiId)
    get.mockResolvedValue({ ...success, data: { ...emojiData, name: "Changed" } })
    expect((await manager.fetch(emojiId, { cache: false }))?.name).toBe("Changed")
    expect(await manager.fetch(emojiId)).toBe(original)
    expect((await manager.fetch(emojiId, { force: true }))?.name).toBe("Changed")
    get.mockResolvedValue({ ...success, data: [] })
    const empty = await manager.fetch()
    get.mockResolvedValue({ ...success, data: [emojiData] })
    expect((await manager.fetch(undefined, { cache: false }))?.length).toBe(1)
    expect(await manager.fetch()).toBe(empty)
    expect((await manager.fetch(undefined, { force: true }))?.length).toBe(1)
    client.setToken("second")
    await manager.fetch()
    expect(get.mock.calls.at(-1)?.[1]).toEqual([{ key: "Authorization", value: "Bot second" }])
})

test("API failures and transport exceptions return null/false without poisoning caches", async () => {
    const failed: IRequestResponse<IEmoji> = { success: false, statusCode: 429, headers: [], error: "Rate limited" }
    const get = spyOn(HttpClient, "get").mockResolvedValue(success)
    const post = spyOn(HttpClient, "post").mockResolvedValue(failed)
    const patch = spyOn(HttpClient, "patch").mockResolvedValue(failed)
    const remove = spyOn(HttpClient, "delete").mockResolvedValue(failed)
    const manager = new GuildEmojiManager(new DiscordRestClient().setToken("token"), guildId)
    const cached = await manager.fetch(emojiId)
    expect(await manager.create({ name: "Wave", image })).toBeNull()
    expect(await manager.edit(emojiId)).toBeNull()
    expect(await manager.delete(emojiId)).toBe(false)
    expect(await manager.fetch(emojiId)).toBe(cached)
    for (const request of [get, post, patch, remove]) request.mockRejectedValue(new Error("offline"))
    expect(await manager.fetch(emojiId, { force: true })).toBeNull()
    expect(await manager.fetch()).toBeNull()
    expect(await manager.create({ name: "Wave", image })).toBeNull()
    expect(await manager.edit(emojiId)).toBeNull()
    expect(await manager.delete(emojiId)).toBe(false)
    expect(await manager.fetch(emojiId)).toBe(cached)
})

test("guild mutations reject Unicode, application and foreign guild snapshots", async () => {
    const patch = spyOn(HttpClient, "patch")
    const remove = spyOn(HttpClient, "delete")
    const client = new DiscordRestClient().setToken("token")
    const manager = new GuildEmojiManager(client, guildId)
    for (const emoji of [
        new Emoji(client, { id: null, name: "🔥" }),
        new Emoji(client, emojiData, applicationId),
        new ApplicationEmoji(client, { ...emojiData, id: emojiId, name: "Wave" }, applicationId),
    ]) {
        await expect(manager.edit(emoji)).rejects.toThrow(TypeError)
        await expect(manager.delete(emoji)).rejects.toThrow(TypeError)
    }
    expect(patch).not.toHaveBeenCalled()
    expect(remove).not.toHaveBeenCalled()
})

test("invalid names, roles, image data and identifiers reject before sending", async () => {
    const post = spyOn(HttpClient, "post")
    const patch = spyOn(HttpClient, "patch")
    const client = new DiscordRestClient().setToken("token")
    const manager = new GuildEmojiManager(client, guildId)
    await expect(manager.create({ name: " ", image })).rejects.toThrow(TypeError)
    await expect(manager.create({ name: "Wave", image: "https://example.com/emoji.png" })).rejects.toThrow(TypeError)
    await expect(manager.create({ name: "Wave", image, roles: ["bad" as Snowflake] })).rejects.toThrow(TypeError)
    await expect(
        manager.create({ name: "Wave", image: `data:image/png;base64,${Buffer.alloc(262145).toString("base64")}` }),
    ).rejects.toThrow(RangeError)
    await expect(manager.edit(emojiId, { roles: ["bad" as Snowflake] })).rejects.toThrow(TypeError)
    await expect(manager.edit(emojiId, { name: "" })).rejects.toThrow(TypeError)
    expect(() => manager.fetch("bad/path" as Snowflake)).toThrow(TypeError)
    expect(() => new GuildEmojiManager(client, "bad/path" as Snowflake)).toThrow(TypeError)
    expect(post).not.toHaveBeenCalled()
    expect(patch).not.toHaveBeenCalled()
})

test("a guild read started before an edit cannot restore a stale cache entry", async () => {
    let complete!: (value: IRequestResponse<IEmoji>) => void
    const pendingResponse = new Promise<IRequestResponse<IEmoji>>((resolve) => {
        complete = resolve
    })
    const get = spyOn(HttpClient, "get").mockReturnValueOnce(pendingResponse as ReturnType<typeof HttpClient.get>)
    spyOn(HttpClient, "patch").mockResolvedValue(success)
    const manager = new GuildEmojiManager(new DiscordRestClient().setToken("token"), guildId)
    const pending = manager.fetch(emojiId)
    await manager.edit(emojiId, { name: "Changed" })
    complete(success)
    await pending
    get.mockResolvedValue({ ...success, data: { ...emojiData, name: "Changed" } })
    expect((await manager.fetch(emojiId))?.name).toBe("Changed")
    expect(get).toHaveBeenCalledTimes(2)
})
