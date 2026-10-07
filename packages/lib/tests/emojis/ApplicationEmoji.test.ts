import { afterEach, expect, mock, spyOn, test } from "bun:test"
import { ApplicationEmoji } from "../../src/sdk/emojis/ApplicationEmoji"
import { DiscordRestClient } from "../../src/sdk/client/DiscordRestClient"
import type { IApplicationEmoji } from "../../src/models/sdk/emojis/base/interfaces/IApplicationEmoji"
import type { IRequestResponse } from "../../src/models/internal/clients/http/interfaces/IRequestResponse"
import { HttpClient, emojiData, emojiId, applicationId } from "./fixtures"

const data: IApplicationEmoji = { ...emojiData, id: emojiId, name: "Wave" }
const success: IRequestResponse<IApplicationEmoji> = { success: true, statusCode: 200, headers: [], data }
const url = `https://discord.com/api/v10/applications/${applicationId}/emojis/${emojiId}`
afterEach(() => mock.restore())

test("application snapshot validates ownership and narrows nullable resource properties", () => {
    const client = new DiscordRestClient()
    const emoji = new ApplicationEmoji(client, data, applicationId)
    expect(emoji.id).toBe(emojiId)
    expect(emoji.name).toBe("Wave")
    expect(emoji.applicationId).toBe(applicationId)
    expect(emoji.guildId).toBeUndefined()
    expect(() => new ApplicationEmoji(client, { ...data, name: "" }, applicationId)).toThrow(TypeError)
    expect(() => new ApplicationEmoji(client, { ...data, id: "bad" as typeof emojiId }, applicationId)).toThrow(
        TypeError,
    )
})

test("instance fetch authenticates the application route and caches successful snapshots", async () => {
    const get = spyOn(HttpClient, "get").mockResolvedValue(success)
    const emoji = new ApplicationEmoji(new DiscordRestClient().setToken("token"), data, applicationId)
    const fetched = await emoji.fetch()
    expect(fetched).toBeInstanceOf(ApplicationEmoji)
    expect(get).toHaveBeenCalledWith(url, [{ key: "Authorization", value: "Bot token" }], { body: undefined })
    expect(await emoji.fetch()).toBe(fetched)
    get.mockResolvedValue({ ...success, data: { ...data, name: "Changed" } })
    expect((await emoji.fetch({ cache: false }))?.name).toBe("Changed")
    expect(await emoji.fetch()).toBe(fetched)
    expect((await emoji.fetch({ force: true }))?.name).toBe("Changed")
    expect(get).toHaveBeenCalledTimes(3)
})

test("instance rename sends name only, clears cache and returns a new snapshot", async () => {
    const get = spyOn(HttpClient, "get").mockResolvedValue(success)
    const patch = spyOn(HttpClient, "patch").mockResolvedValue({ ...success, data: { ...data, name: "Greeting" } })
    const client = new DiscordRestClient().setToken("token")
    const emoji = new ApplicationEmoji(client, data, applicationId)
    await emoji.fetch()
    const renamed = await emoji.edit({ name: "Greeting" })
    expect(renamed?.name).toBe("Greeting")
    expect(emoji.name).toBe("Wave")
    expect(patch).toHaveBeenCalledWith(
        url,
        [
            { key: "Authorization", value: "Bot token" },
            { key: "Content-Type", value: "application/json" },
        ],
        { body: { name: "Greeting" } },
    )
    await emoji.fetch()
    expect(get).toHaveBeenCalledTimes(2)
    await expect(emoji.edit({ name: " " })).rejects.toThrow(TypeError)
    expect(patch).toHaveBeenCalledTimes(1)
})

test("instance deletion accepts empty 204 responses and invalidates cached snapshots", async () => {
    const get = spyOn(HttpClient, "get").mockResolvedValue(success)
    const remove = spyOn(HttpClient, "delete").mockResolvedValue({
        success: true,
        statusCode: 204,
        headers: [],
        data: undefined,
    })
    const emoji = new ApplicationEmoji(new DiscordRestClient().setToken("token"), data, applicationId)
    await emoji.fetch()
    expect(await emoji.delete()).toBe(true)
    expect(remove).toHaveBeenCalledWith(url, [{ key: "Authorization", value: "Bot token" }], { body: undefined })
    await emoji.fetch()
    expect(get).toHaveBeenCalledTimes(2)
})

test("API and transport failures return null/false without replacing existing cache entries", async () => {
    const get = spyOn(HttpClient, "get").mockResolvedValue(success)
    const patch = spyOn(HttpClient, "patch").mockResolvedValue({
        success: false,
        statusCode: 403,
        headers: [],
        error: "Forbidden",
    })
    const remove = spyOn(HttpClient, "delete").mockRejectedValue(new Error("offline"))
    const emoji = new ApplicationEmoji(new DiscordRestClient().setToken("token"), data, applicationId)
    const cached = await emoji.fetch()
    expect(await emoji.edit({ name: "Greeting" })).toBeNull()
    expect(await emoji.delete()).toBe(false)
    expect(await emoji.fetch()).toBe(cached)
    get.mockRejectedValue(new Error("offline"))
    expect(await emoji.fetch({ force: true })).toBeNull()
    patch.mockRejectedValue(new Error("offline"))
    remove.mockResolvedValue({ success: false, statusCode: 403, headers: [], error: {} })
    expect(await emoji.edit({ name: "Greeting" })).toBeNull()
    expect(await emoji.delete()).toBe(false)
})
