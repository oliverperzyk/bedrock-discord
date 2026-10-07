import { afterEach, expect, mock, spyOn, test } from "bun:test"
import { HttpClient, stickerData, packId } from "./fixtures"
import { DiscordRestClient } from "../../src/sdk/client/DiscordRestClient"
import { StickerPack } from "../../src/sdk/stickers/StickerPack"
import { Sticker } from "../../src/sdk/stickers/Sticker"
import type { IStickerPack } from "../../src/models/sdk/stickers/base/interfaces/IStickerPack"

const packData: IStickerPack = {
    id: packId,
    name: "Wumpus",
    stickers: [stickerData],
    sku_id: packId,
    cover_sticker_id: stickerData.id,
    description: "Greetings",
    banner_asset_id: packId,
}
const success = { success: true as const, statusCode: 200, headers: [], data: packData }
afterEach(() => mock.restore())

test("pack GET maps metadata and nested stickers; instance fetch uses the cache", async () => {
    const get = spyOn(HttpClient, "get").mockResolvedValue(success)
    const client = new DiscordRestClient().setToken("token")
    const pack = await StickerPack.fetch(client, packId)
    expect(get.mock.calls[0]?.[0]).toBe(`https://discord.com/api/v10/sticker-packs/${packId}`)
    expect(pack?.skuId).toBe(packData.sku_id)
    expect(pack?.coverStickerId).toBe(stickerData.id)
    expect(pack?.bannerAssetId).toBe(packId)
    expect(pack?.stickers[0]).toBeInstanceOf(Sticker)
    expect(pack?.stickers[0]?.client).toBe(client)
    expect(await pack?.fetch()).toBe(pack)
    expect(get).toHaveBeenCalledTimes(1)
})

test("pack listing unwraps sticker_packs, caches and force-refreshes", async () => {
    const get = spyOn(HttpClient, "get").mockResolvedValue({ ...success, data: { sticker_packs: [packData] } })
    const client = new DiscordRestClient().setToken("token")
    const packs = await StickerPack.fetchAll(client)
    expect(get.mock.calls[0]?.[0]).toBe("https://discord.com/api/v10/sticker-packs")
    expect(get.mock.calls[0]?.[1]).toEqual([{ key: "Authorization", value: "Bot token" }])
    expect(packs?.[0]).toBeInstanceOf(StickerPack)
    expect(await StickerPack.fetchAll(client)).toBe(packs)
    get.mockResolvedValue({ ...success, data: { sticker_packs: [] } })
    expect(await StickerPack.fetchAll(client, { cache: false })).toEqual([])
    expect(await StickerPack.fetchAll(client)).toBe(packs)
    expect(await StickerPack.fetchAll(client, { force: true })).toEqual([])
    expect(await StickerPack.fetchAll(client)).toEqual([])
    expect(get).toHaveBeenCalledTimes(3)
})

test("pack failures return null without poisoning subsequent reads", async () => {
    const get = spyOn(HttpClient, "get").mockRejectedValue(new Error("offline"))
    const client = new DiscordRestClient().setToken("token")
    expect(await StickerPack.fetch(client, packId)).toBeNull()
    expect(await StickerPack.fetchAll(client)).toBeNull()
    get.mockResolvedValue(success)
    expect(await StickerPack.fetch(client, packId)).toBeInstanceOf(StickerPack)
})

test("optional artwork fields remain undefined and empty packs hydrate", () => {
    const pack = new StickerPack(new DiscordRestClient(), {
        id: packId,
        name: "Empty",
        description: "No stickers",
        sku_id: packId,
        stickers: [],
    })
    expect(pack.stickers).toEqual([])
    expect(pack.coverStickerId).toBeUndefined()
    expect(pack.bannerAssetId).toBeUndefined()
})
