import { afterEach, expect, mock, spyOn, test } from "bun:test"
import { HttpClient, stickerData, stickerId, guildId } from "./fixtures"
import { DiscordRestClient } from "../../src/sdk/client/DiscordRestClient"
import { Sticker } from "../../src/sdk/stickers/Sticker"
import { StickerType } from "../../src/models/sdk/stickers/base/enums/StickerType"
import type { IRequestResponse } from "../../src/models/internal/clients/http/interfaces/IRequestResponse"
import type { ISticker } from "../../src/models/sdk/stickers/base/interfaces/ISticker"

const success: IRequestResponse<ISticker> = { success: true, statusCode: 200, headers: [], data: stickerData }
afterEach(() => mock.restore())

test("global fetch delegates an authenticated GET and hydrates snake_case fields", async () => {
    const get = spyOn(HttpClient, "get").mockResolvedValue(success)
    const client = new DiscordRestClient().setToken("Bot test-token")
    const sticker = await Sticker.fetch(client, stickerId)
    expect(get).toHaveBeenCalledWith(
        `https://discord.com/api/v10/stickers/${stickerId}`,
        [{ key: "Authorization", value: "Bot test-token" }],
        { body: undefined },
    )
    expect(sticker).toBeInstanceOf(Sticker)
    expect(sticker?.packId).toBe(stickerData.pack_id)
    expect(sticker?.formatType).toBe(2)
    expect(sticker?.sortValue).toBe(12)
    expect(sticker?.description).toBeNull()
    expect(sticker?.guildId).toBeUndefined()
    expect(await sticker?.fetch()).toBe(sticker)
    expect(get).toHaveBeenCalledTimes(1)
})

test("guild sticker preserves unavailable state and uploader data", () => {
    const user = { id: stickerId, username: "Uploader", discriminator: "0", global_name: null, avatar: null }
    const sticker = new Sticker(new DiscordRestClient(), {
        ...stickerData,
        type: StickerType.GUILD,
        guild_id: guildId,
        available: false,
        user,
    })
    expect(sticker.guildId).toBe(guildId)
    expect(sticker.available).toBe(false)
    expect(sticker.user).toEqual(user)
})

test("force refreshes cache; cache=false neither reads nor writes", async () => {
    const get = spyOn(HttpClient, "get").mockResolvedValue(success)
    const client = new DiscordRestClient().setToken("token")
    const original = await Sticker.fetch(client, stickerId)
    get.mockResolvedValue({ ...success, data: { ...stickerData, name: "Updated" } })
    const bypass = await Sticker.fetch(client, stickerId, { cache: false })
    expect(bypass?.name).toBe("Updated")
    expect(await Sticker.fetch(client, stickerId)).toBe(original)
    const refreshed = await Sticker.fetch(client, stickerId, { force: true })
    expect(refreshed?.name).toBe("Updated")
    expect(await Sticker.fetch(client, stickerId)).toBe(refreshed)
    expect(get).toHaveBeenCalledTimes(3)
})

test("caches are isolated by client and cleared when token changes", async () => {
    const get = spyOn(HttpClient, "get").mockResolvedValue(success)
    const first = new DiscordRestClient().setToken("first")
    const second = new DiscordRestClient().setToken("second")
    await Sticker.fetch(first, stickerId)
    await Sticker.fetch(second, stickerId)
    first.setToken("changed")
    await Sticker.fetch(first, stickerId)
    expect(get).toHaveBeenCalledTimes(3)
    expect(get.mock.calls[2]?.[1]).toEqual([{ key: "Authorization", value: "Bot changed" }])
})

test("failed responses and transport exceptions are not cached", async () => {
    const get = spyOn(HttpClient, "get").mockResolvedValue({ success: false, statusCode: 404, headers: [], error: {} })
    const client = new DiscordRestClient().setToken("token")
    expect(await Sticker.fetch(client, stickerId)).toBeNull()
    get.mockRejectedValue(new Error("offline"))
    expect(await Sticker.fetch(client, stickerId)).toBeNull()
    get.mockResolvedValue(success)
    expect(await Sticker.fetch(client, stickerId)).toBeInstanceOf(Sticker)
    expect(get).toHaveBeenCalledTimes(3)
})

test("missing and malformed tokens throw before any HTTP request", async () => {
    const get = spyOn(HttpClient, "get")
    expect(() => new DiscordRestClient().setToken(" ")).toThrow(TypeError)
    expect(() => new DiscordRestClient().setToken("line\nbreak")).toThrow(TypeError)
    await expect(Sticker.fetch(new DiscordRestClient(), stickerId)).rejects.toThrow("setToken")
    expect(get).not.toHaveBeenCalled()
})

test("an in-flight request cannot repopulate a cache after token rotation", async () => {
    let complete!: (value: IRequestResponse<ISticker>) => void
    const response = new Promise<IRequestResponse<ISticker>>((resolve) => {
        complete = resolve
    })
    const get = spyOn(HttpClient, "get").mockReturnValueOnce(response as ReturnType<typeof HttpClient.get>)
    const client = new DiscordRestClient().setToken("first")
    const pending = Sticker.fetch(client, stickerId)
    client.setToken("second")
    complete(success)
    await pending
    get.mockResolvedValue(success)
    await Sticker.fetch(client, stickerId)
    expect(get).toHaveBeenCalledTimes(2)
})
