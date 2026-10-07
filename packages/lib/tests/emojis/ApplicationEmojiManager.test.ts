import { afterEach, expect, mock, spyOn, test } from "bun:test"
import { ApplicationEmojiManager } from "../../src/sdk/emojis/managers/ApplicationEmojiManager"
import { GuildEmojiManager } from "../../src/sdk/emojis/managers/GuildEmojiManager"
import { ApplicationEmoji } from "../../src/sdk/emojis/ApplicationEmoji"
import { Emoji } from "../../src/sdk/emojis/Emoji"
import { DiscordRestClient } from "../../src/sdk/client/DiscordRestClient"
import type { IApplicationEmoji } from "../../src/models/sdk/emojis/base/interfaces/IApplicationEmoji"
import type { IRequestResponse } from "../../src/models/internal/clients/http/interfaces/IRequestResponse"
import { HttpClient, emojiData, emojiId, guildId, applicationId, image } from "./fixtures"

const data: IApplicationEmoji = { ...emojiData, id: emojiId, name: "Wave" }
const success: IRequestResponse<IApplicationEmoji> = { success: true, statusCode: 200, headers: [], data }
const collection = `https://discord.com/api/v10/applications/${applicationId}/emojis`
const item = `${collection}/${emojiId}`
afterEach(() => mock.restore())

test("application list unwraps items and item GET shares instance cache entries", async () => {
    const get = spyOn(HttpClient, "get").mockResolvedValue({ ...success, data: { items: [data] } })
    const manager = new ApplicationEmojiManager(new DiscordRestClient().setToken("token"), applicationId)
    const emojis = await manager.fetch()
    expect(get).toHaveBeenCalledWith(collection, [{ key: "Authorization", value: "Bot token" }], { body: undefined })
    expect(emojis?.[0]).toBeInstanceOf(ApplicationEmoji)
    expect(emojis?.[0]?.applicationId).toBe(applicationId)
    expect(emojis?.[0]?.user?.username).toBe("Uploader")
    expect(await manager.fetch()).toBe(emojis)
    get.mockResolvedValue(success)
    const emoji = await manager.fetch(emojiId)
    expect(get.mock.calls[1]?.[0]).toBe(item)
    expect(await emoji?.fetch()).toBe(emoji)
    expect(get).toHaveBeenCalledTimes(2)
})

test("application POST and PATCH contain only supported JSON fields; DELETE accepts empty 204", async () => {
    const post = spyOn(HttpClient, "post").mockResolvedValue(success)
    const patch = spyOn(HttpClient, "patch").mockResolvedValue(success)
    const remove = spyOn(HttpClient, "delete").mockResolvedValue({
        success: true,
        statusCode: 204,
        headers: [],
        data: undefined,
    })
    const client = new DiscordRestClient().setToken("token")
    const manager = new ApplicationEmojiManager(client, applicationId)
    const extraCreate = { name: "Wave", image, roles: [guildId], reason: "Not supported" }
    const created = await manager.create(extraCreate)
    expect(created).toBeInstanceOf(ApplicationEmoji)
    expect(post).toHaveBeenCalledWith(
        collection,
        [
            { key: "Authorization", value: "Bot token" },
            { key: "Content-Type", value: "application/json" },
        ],
        { body: { name: "Wave", image } },
    )
    const extraEdit = { name: "Greeting", roles: null, reason: "Not supported" }
    expect(await manager.edit(created!, extraEdit)).toBeInstanceOf(ApplicationEmoji)
    expect(patch).toHaveBeenCalledWith(
        item,
        [
            { key: "Authorization", value: "Bot token" },
            { key: "Content-Type", value: "application/json" },
        ],
        { body: { name: "Greeting" } },
    )
    expect(await manager.delete(created!)).toBe(true)
    expect(remove).toHaveBeenCalledWith(item, [{ key: "Authorization", value: "Bot token" }], { body: undefined })
})

test("force/cache controls handle application items and empty collection responses", async () => {
    const get = spyOn(HttpClient, "get").mockResolvedValue(success)
    const client = new DiscordRestClient().setToken("first")
    const manager = new ApplicationEmojiManager(client, applicationId)
    const original = await manager.fetch(emojiId)
    get.mockResolvedValue({ ...success, data: { ...data, name: "Changed" } })
    expect((await manager.fetch(emojiId, { cache: false }))?.name).toBe("Changed")
    expect(await manager.fetch(emojiId)).toBe(original)
    expect((await manager.fetch(emojiId, { force: true }))?.name).toBe("Changed")
    get.mockResolvedValue({ ...success, data: { items: [] } })
    const empty = await manager.fetch()
    expect(empty).toEqual([])
    get.mockResolvedValue({ ...success, data: { items: [data] } })
    expect((await manager.fetch(undefined, { cache: false }))?.length).toBe(1)
    expect(await manager.fetch()).toBe(empty)
    expect((await manager.fetch(undefined, { force: true }))?.length).toBe(1)
    client.setToken("second")
    await manager.fetch()
    expect(get.mock.calls.at(-1)?.[1]).toEqual([{ key: "Authorization", value: "Bot second" }])
})

test("manager and instance mutations invalidate shared caches without affecting other owners or guild resources", async () => {
    const get = spyOn(HttpClient, "get").mockResolvedValue(success)
    spyOn(HttpClient, "post").mockResolvedValue(success)
    spyOn(HttpClient, "patch").mockResolvedValue(success)
    spyOn(HttpClient, "delete").mockResolvedValue({ success: true, statusCode: 204, headers: [], data: undefined })
    const client = new DiscordRestClient().setToken("token")
    const manager = new ApplicationEmojiManager(client, applicationId)
    const same = new ApplicationEmojiManager(client, applicationId)
    const otherOwner = new ApplicationEmojiManager(client, guildId)
    const otherClient = new ApplicationEmojiManager(new DiscordRestClient().setToken("other"), applicationId)
    const guild = new GuildEmojiManager(client, guildId)
    const ownerCached = await otherOwner.fetch(emojiId)
    const clientCached = await otherClient.fetch(emojiId)
    const guildCached = await guild.fetch(emojiId)
    const snapshot = new ApplicationEmoji(client, data, applicationId)
    for (const mutate of [
        () => manager.create({ name: "Wave", image }),
        () => manager.edit(emojiId, { name: "Greeting" }),
        () => manager.delete(emojiId),
        () => snapshot.edit({ name: "Greeting" }),
        () => snapshot.delete(),
    ]) {
        get.mockResolvedValue(success)
        await manager.fetch(emojiId)
        get.mockResolvedValue({ ...success, data: { items: [data] } })
        await manager.fetch()
        const count = get.mock.calls.length
        await mutate()
        get.mockResolvedValue(success)
        await same.fetch(emojiId)
        get.mockResolvedValue({ ...success, data: { items: [] } })
        expect(await same.fetch()).toEqual([])
        expect(get.mock.calls.length).toBe(count + 2)
        expect(await otherOwner.fetch(emojiId)).toBe(ownerCached)
        expect(await otherClient.fetch(emojiId)).toBe(clientCached)
        expect(await guild.fetch(emojiId)).toBe(guildCached)
    }
})

test("application API failures and exceptions return null/false and do not cache failed reads", async () => {
    const failure: IRequestResponse<IApplicationEmoji> = { success: false, statusCode: 403, headers: [], error: {} }
    const get = spyOn(HttpClient, "get").mockResolvedValue(failure)
    const post = spyOn(HttpClient, "post").mockResolvedValue(failure)
    const patch = spyOn(HttpClient, "patch").mockResolvedValue(failure)
    const remove = spyOn(HttpClient, "delete").mockResolvedValue(failure)
    const manager = new ApplicationEmojiManager(new DiscordRestClient().setToken("token"), applicationId)
    expect(await manager.fetch(emojiId)).toBeNull()
    expect(await manager.fetch()).toBeNull()
    expect(await manager.create({ name: "Wave", image })).toBeNull()
    expect(await manager.edit(emojiId, { name: "Greeting" })).toBeNull()
    expect(await manager.delete(emojiId)).toBe(false)
    for (const request of [get, post, patch, remove]) request.mockRejectedValue(new Error("offline"))
    expect(await manager.fetch(emojiId)).toBeNull()
    expect(await manager.fetch()).toBeNull()
    expect(await manager.create({ name: "Wave", image })).toBeNull()
    expect(await manager.edit(emojiId, { name: "Greeting" })).toBeNull()
    expect(await manager.delete(emojiId)).toBe(false)
    get.mockResolvedValue(success)
    expect(await manager.fetch(emojiId)).toBeInstanceOf(ApplicationEmoji)
})

test("application mutation targets reject Unicode, guild and other-application snapshots", async () => {
    const patch = spyOn(HttpClient, "patch")
    const remove = spyOn(HttpClient, "delete")
    const client = new DiscordRestClient().setToken("token")
    const manager = new ApplicationEmojiManager(client, applicationId)
    for (const emoji of [
        new Emoji(client, { id: null, name: "🔥" }),
        new Emoji(client, emojiData, guildId),
        new ApplicationEmoji(client, data, guildId),
    ]) {
        await expect(manager.edit(emoji, { name: "Greeting" })).rejects.toThrow(TypeError)
        await expect(manager.delete(emoji)).rejects.toThrow(TypeError)
    }
    expect(patch).not.toHaveBeenCalled()
    expect(remove).not.toHaveBeenCalled()
})

test("application creation accepts each supported image format and rejects invalid/oversized input", async () => {
    const post = spyOn(HttpClient, "post").mockResolvedValue(success)
    const manager = new ApplicationEmojiManager(new DiscordRestClient().setToken("token"), applicationId)
    for (const format of ["jpeg", "png", "gif", "webp", "avif"]) {
        expect(await manager.create({ name: "Wave", image: `data:image/${format};base64,AQ==` })).toBeInstanceOf(
            ApplicationEmoji,
        )
    }
    expect(
        await manager.create({
            name: "Wave",
            image: `data:image/png;base64,${Buffer.alloc(262144).toString("base64")}`,
        }),
    ).toBeInstanceOf(ApplicationEmoji)
    await expect(manager.create({ name: "Wave", image: "data:image/png;base64,AB==" })).rejects.toThrow(TypeError)
    await expect(
        manager.create({ name: "Wave", image: `data:image/png;base64,${Buffer.alloc(262145).toString("base64")}` }),
    ).rejects.toThrow(RangeError)
    await expect(manager.create({ name: " ", image })).rejects.toThrow(TypeError)
    expect(post).toHaveBeenCalledTimes(6)
})

test("a late application read cannot refill cache after deletion", async () => {
    let complete!: (response: IRequestResponse<IApplicationEmoji>) => void
    const response = new Promise<IRequestResponse<IApplicationEmoji>>((resolve) => {
        complete = resolve
    })
    const get = spyOn(HttpClient, "get").mockReturnValueOnce(response as ReturnType<typeof HttpClient.get>)
    spyOn(HttpClient, "delete").mockResolvedValue({ success: true, statusCode: 204, headers: [], data: undefined })
    const manager = new ApplicationEmojiManager(new DiscordRestClient().setToken("token"), applicationId)
    const pending = manager.fetch(emojiId)
    await manager.delete(emojiId)
    complete(success)
    await pending
    get.mockResolvedValue({ success: false, statusCode: 404, headers: [], error: {} })
    expect(await manager.fetch(emojiId)).toBeNull()
    expect(get).toHaveBeenCalledTimes(2)
})
