import { afterEach, expect, mock, spyOn, test } from "bun:test"
import { HttpClient, stickerData, stickerId, guildId } from "./fixtures"
import { DiscordRestClient } from "../../src/sdk/client/DiscordRestClient"
import { GuildStickerManager } from "../../src/sdk/stickers/GuildStickerManager"
import { Sticker } from "../../src/sdk/stickers/Sticker"
import { StickerType } from "../../src/models/sdk/stickers/base/enums/StickerType"
import type { Snowflake } from "../../src/models/sdk/data/snowflakes/types/Snowflake"
import type { ISticker } from "../../src/models/sdk/stickers/base/interfaces/ISticker"
import type { IStickerMultipartRequest } from "../../src/models/sdk/stickers/client/interfaces/IStickerMultipartRequest"
import type { IGuildStickerCreateOptions } from "../../src/models/sdk/stickers/client/interfaces/IGuildStickerCreateOptions"
import type { IRequestResponse } from "../../src/models/internal/clients/http/interfaces/IRequestResponse"
import type { StickerContentType } from "../../src/models/sdk/stickers/client/types/StickerContentType"

const guildData: ISticker = { ...stickerData, type: StickerType.GUILD, guild_id: guildId, available: true }
const success: IRequestResponse<ISticker> = { success: true, statusCode: 200, headers: [], data: guildData }
const failure: IRequestResponse = { success: false, statusCode: 403, headers: [], error: { message: "Forbidden" } }
const collectionUrl = `https://discord.com/api/v10/guilds/${guildId}/stickers`
const stickerUrl = `${collectionUrl}/${stickerId}`
const reason = "Greeting / update 🐱"
const createOptions: IGuildStickerCreateOptions = {
    name: "Wave",
    tags: "hello",
    file: {
        data: new Uint8Array([0, 127, 128, 255]),
        filename: "wave.png",
        contentType: "image/png",
    },
}
afterEach(() => mock.restore())

test("fetch overloads hit guild routes and share caches across managers", async () => {
    const get = spyOn(HttpClient, "get").mockResolvedValue(success)
    const client = new DiscordRestClient().setToken("token")
    const manager = new GuildStickerManager(client, guildId)
    const sticker = await manager.fetch(stickerId)
    expect(sticker).toBeInstanceOf(Sticker)
    expect(get.mock.calls[0]?.[0]).toBe(stickerUrl)
    expect(get.mock.calls[0]?.[1]).toEqual([{ key: "Authorization", value: "Bot token" }])
    expect(await new GuildStickerManager(client, guildId).fetch(stickerId)).toBe(sticker)
    get.mockResolvedValue({ ...success, data: [guildData] })
    const list = await manager.fetch()
    expect(list?.[0]).toBeInstanceOf(Sticker)
    expect(list?.[0]?.guildId).toBe(guildId)
    expect(get.mock.calls[1]?.[0]).toBe(collectionUrl)
    expect(await manager.fetch()).toBe(list)
    expect(get).toHaveBeenCalledTimes(2)
})

test("guild reads respect force/cache controls and preserve an empty list", async () => {
    const get = spyOn(HttpClient, "get").mockResolvedValue({ ...success, data: [] })
    const manager = new GuildStickerManager(new DiscordRestClient().setToken("token"), guildId)
    const original = await manager.fetch()
    expect(original).toEqual([])
    get.mockResolvedValue({ ...success, data: [guildData] })
    expect((await manager.fetch(undefined, { cache: false }))?.length).toBe(1)
    expect(await manager.fetch()).toBe(original)
    expect((await manager.fetch(undefined, { force: true }))?.length).toBe(1)
    get.mockResolvedValue(success)
    const single = await manager.fetch(stickerId)
    get.mockResolvedValue({ ...success, data: { ...guildData, name: "Updated" } })
    expect((await manager.fetch(stickerId, { cache: false }))?.name).toBe("Updated")
    expect(await manager.fetch(stickerId)).toBe(single)
    expect((await manager.fetch(stickerId, { force: true }))?.name).toBe("Updated")
})

test("edit sends supplied fields and null descriptions with encoded audit headers and JSON content type", async () => {
    const patch = spyOn(HttpClient, "patch").mockResolvedValue(success)
    const client = new DiscordRestClient().setToken("token")
    const manager = new GuildStickerManager(client, guildId)
    const result = await manager.edit(new Sticker(client, guildData), { description: null, reason })
    expect(result).toBeInstanceOf(Sticker)
    expect(patch).toHaveBeenCalledWith(
        stickerUrl,
        [
            { key: "Authorization", value: "Bot token" },
            { key: "X-Audit-Log-Reason", value: encodeURIComponent(reason) },
            { key: "Content-Type", value: "application/json" },
        ],
        { body: { description: null } },
    )
    await manager.edit(stickerId, { name: "Hello", tags: "greeting" })
    expect(patch.mock.calls[1]?.[2]?.body).toEqual({ name: "Hello", tags: "greeting" })
    await manager.edit(stickerId)
    expect(patch.mock.calls[2]?.[2]?.body).toEqual({})
})

test("delete accepts 204 with no body and encodes the audit reason", async () => {
    const remove = spyOn(HttpClient, "delete").mockResolvedValue({
        success: true,
        statusCode: 204,
        headers: [],
        data: undefined,
    })
    const manager = new GuildStickerManager(new DiscordRestClient().setToken("token"), guildId)
    expect(await manager.delete(stickerId, reason)).toBe(true)
    expect(remove).toHaveBeenCalledWith(
        stickerUrl,
        [
            { key: "Authorization", value: "Bot token" },
            { key: "X-Audit-Log-Reason", value: encodeURIComponent(reason) },
        ],
        { body: undefined },
    )
})

test("all successful mutations invalidate guild and global caches while other guilds/clients retain data", async () => {
    const get = spyOn(HttpClient, "get").mockResolvedValue(success)
    spyOn(HttpClient, "patch").mockResolvedValue(success)
    spyOn(HttpClient, "delete").mockResolvedValue({ success: true, statusCode: 204, headers: [], data: undefined })
    const uploader = mock(async () => success)
    const client = new DiscordRestClient().setToken("first").setMultipartUploader(uploader)
    const secondClient = new DiscordRestClient().setToken("second")
    const otherGuild = "847199849233514547" as Snowflake
    const manager = new GuildStickerManager(client, guildId)
    const shared = new GuildStickerManager(client, guildId)
    const foreign = new GuildStickerManager(client, otherGuild)
    const otherClient = new GuildStickerManager(secondClient, guildId)
    const foreignCached = await foreign.fetch(stickerId)
    const otherCached = await otherClient.fetch(stickerId)
    for (const mutate of [
        () => manager.edit(stickerId, { name: "Hello" }),
        () => manager.create(createOptions),
        () => manager.delete(stickerId),
    ]) {
        get.mockResolvedValue(success)
        await manager.fetch(stickerId)
        await Sticker.fetch(client, stickerId)
        get.mockResolvedValue({ ...success, data: [guildData] })
        await manager.fetch()
        const count = get.mock.calls.length
        await mutate()
        get.mockResolvedValue(success)
        await shared.fetch(stickerId)
        await Sticker.fetch(client, stickerId)
        get.mockResolvedValue({ ...success, data: [] })
        expect(await shared.fetch()).toEqual([])
        expect(get.mock.calls.length).toBe(count + 3)
        expect(await foreign.fetch(stickerId)).toBe(foreignCached)
        expect(await otherClient.fetch(stickerId)).toBe(otherCached)
    }
})

test("create passes binary data, separate form fields and audit header to the adapter", async () => {
    const post = spyOn(HttpClient, "post")
    const uploader = mock(async (request: IStickerMultipartRequest) => {
        expect(request.method).toBe("POST")
        return success
    })
    const client = new DiscordRestClient().setToken("token").setMultipartUploader(uploader)
    const manager = new GuildStickerManager(client, guildId)
    expect(await manager.create({ ...createOptions, reason })).toBeInstanceOf(Sticker)
    expect(uploader).toHaveBeenCalledWith({
        url: collectionUrl,
        method: "POST",
        headers: [
            { key: "Authorization", value: "Bot token" },
            { key: "X-Audit-Log-Reason", value: encodeURIComponent(reason) },
        ],
        fields: { name: "Wave", description: "", tags: "hello" },
        file: createOptions.file,
    })
    expect(uploader.mock.calls[0]?.[0].file.data).toBe(createOptions.file.data)
    expect(Array.from(uploader.mock.calls[0]![0].file.data)).toEqual([0, 127, 128, 255])
    expect(post).not.toHaveBeenCalled()
})

test.each(["image/png", "image/apng", "image/gif", "application/json"] as const)(
    "create supports %s and the exact 512 KiB limit",
    async (contentType) => {
        const uploader = mock(async () => success)
        const manager = new GuildStickerManager(
            new DiscordRestClient().setToken("token").setMultipartUploader(uploader),
            guildId,
        )
        expect(
            await manager.create({
                ...createOptions,
                description: "Description",
                file: { ...createOptions.file, contentType, data: new Uint8Array(512 * 1024) },
            }),
        ).toBeInstanceOf(Sticker)
        expect(uploader).toHaveBeenCalledTimes(1)
    },
)

test("missing uploader throws a configuration error before transport", async () => {
    const manager = new GuildStickerManager(new DiscordRestClient().setToken("token"), guildId)
    await expect(manager.create(createOptions)).rejects.toThrow("setMultipartUploader")
})

test("all API and transport failures return null/false and preserve existing cached data", async () => {
    const get = spyOn(HttpClient, "get").mockResolvedValue(success)
    const patch = spyOn(HttpClient, "patch").mockResolvedValue(failure)
    const remove = spyOn(HttpClient, "delete").mockResolvedValue(failure)
    const uploader = mock(async (): Promise<IRequestResponse<ISticker>> => ({
        success: false,
        statusCode: 403,
        headers: [],
        error: {},
    }))
    const client = new DiscordRestClient().setToken("token").setMultipartUploader(uploader)
    const manager = new GuildStickerManager(client, guildId)
    const cached = await manager.fetch(stickerId)
    expect(await manager.edit(stickerId, { name: "Hello" })).toBeNull()
    expect(await manager.delete(stickerId)).toBe(false)
    expect(await manager.create(createOptions)).toBeNull()
    patch.mockRejectedValue(new Error("offline"))
    remove.mockRejectedValue(new Error("offline"))
    uploader.mockRejectedValue(new Error("offline"))
    expect(await manager.edit(stickerId)).toBeNull()
    expect(await manager.delete(stickerId)).toBe(false)
    expect(await manager.create(createOptions)).toBeNull()
    expect(await manager.fetch(stickerId)).toBe(cached)
    get.mockResolvedValue(failure)
    expect(await manager.fetch(stickerId, { force: true })).toBeNull()
    expect(await manager.fetch()).toBeNull()
    get.mockResolvedValue(success)
    expect(await manager.fetch(stickerId, { force: true })).toBeInstanceOf(Sticker)
})

test.each([
    { ...createOptions, name: "x" },
    { ...createOptions, name: "x".repeat(31) },
    { ...createOptions, description: "x" },
    { ...createOptions, description: "x".repeat(101) },
    { ...createOptions, tags: "x".repeat(201) },
    { ...createOptions, file: { ...createOptions.file, data: new Uint8Array(0) } },
    { ...createOptions, file: { ...createOptions.file, data: new Uint8Array(512 * 1024 + 1) } },
    { ...createOptions, file: { ...createOptions.file, filename: "\r\nbad.png" } },
    { ...createOptions, file: { ...createOptions.file, contentType: "image/jpeg" as StickerContentType } },
])("invalid creation input rejects before the adapter is invoked %#", async (options) => {
    const uploader = mock(async () => success)
    const manager = new GuildStickerManager(
        new DiscordRestClient().setToken("token").setMultipartUploader(uploader),
        guildId,
    )
    await expect(manager.create(options)).rejects.toThrow()
    expect(uploader).not.toHaveBeenCalled()
})

test("edit rejects invalid metadata, standard stickers and foreign guild snapshots", async () => {
    const patch = spyOn(HttpClient, "patch")
    const client = new DiscordRestClient().setToken("token")
    const manager = new GuildStickerManager(client, guildId)
    for (const options of [
        { name: "x" },
        { name: "x".repeat(31) },
        { description: "" },
        { description: "x" },
        { description: "x".repeat(101) },
        { tags: "x".repeat(201) },
    ]) {
        await expect(manager.edit(stickerId, options)).rejects.toThrow(RangeError)
    }
    await expect(manager.edit(new Sticker(client, stickerData), { name: "Hello" })).rejects.toThrow("belong")
    await expect(manager.edit(new Sticker(client, { ...guildData, guild_id: "1" as Snowflake }))).rejects.toThrow(
        "belong",
    )
    await expect(manager.edit("bad/id" as Snowflake)).rejects.toThrow("snowflake")
    expect(() => new GuildStickerManager(client, "bad/id" as Snowflake)).toThrow("snowflake")
    expect(patch).not.toHaveBeenCalled()
})

test("Unicode character boundaries are accepted without counting surrogate halves", async () => {
    const patch = spyOn(HttpClient, "patch").mockResolvedValue(success)
    const uploader = mock(async () => success)
    const manager = new GuildStickerManager(
        new DiscordRestClient().setToken("token").setMultipartUploader(uploader),
        guildId,
    )
    await manager.create({
        ...createOptions,
        name: "🐱".repeat(30),
        description: "🐱".repeat(100),
        tags: "🐱".repeat(200),
    })
    await manager.edit(stickerId, { name: "🐱🐱", description: null })
    expect(patch).toHaveBeenCalledTimes(1)
    expect(uploader).toHaveBeenCalledTimes(1)
})

test("pending guild reads cannot restore snapshots after a successful edit", async () => {
    let complete!: (value: IRequestResponse<ISticker>) => void
    const response = new Promise<IRequestResponse<ISticker>>((resolve) => {
        complete = resolve
    })
    const get = spyOn(HttpClient, "get").mockReturnValueOnce(response as ReturnType<typeof HttpClient.get>)
    spyOn(HttpClient, "patch").mockResolvedValue({ ...success, data: { ...guildData, name: "Updated" } })
    const manager = new GuildStickerManager(new DiscordRestClient().setToken("token"), guildId)
    const pending = manager.fetch(stickerId)
    await manager.edit(stickerId, { name: "Updated" })
    complete(success)
    await pending
    get.mockResolvedValue({ ...success, data: { ...guildData, name: "Updated" } })
    expect((await manager.fetch(stickerId))?.name).toBe("Updated")
    expect(get).toHaveBeenCalledTimes(2)
})
