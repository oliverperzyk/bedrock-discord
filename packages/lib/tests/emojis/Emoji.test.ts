import { expect, test } from "bun:test"
import { Emoji } from "../../src/sdk/emojis/Emoji"
import { DiscordRestClient } from "../../src/sdk/client/DiscordRestClient"
import { ImageDataManager } from "../../src/sdk/data/ImageDataManager"
import { assertEmojiImage } from "../../src/internal/emojis/EmojiValidation"
import { emojiData, emojiId, guildId } from "./fixtures"

test("emoji hydrates wire fields and serializes without client or owner context", () => {
    const client = new DiscordRestClient()
    const emoji = new Emoji(client, emojiData, guildId)
    expect(emoji.id).toBe(emojiId)
    expect(emoji.requiresColons).toBe(true)
    expect(emoji.managed).toBe(false)
    expect(emoji.animated).toBe(false)
    expect(emoji.available).toBe(true)
    expect(emoji.roles).toEqual([])
    expect(emoji.user?.public_flags).toBe(131328)
    expect(emoji.guildId).toBe(guildId)
    const json = emoji.toJSON()
    expect(json).toEqual(emojiData)
    expect(json).not.toBe(emojiData)
    expect(json.roles).not.toBe(emojiData.roles)
    expect(json.user).not.toBe(emojiData.user)
    expect(json).not.toHaveProperty("client")
    expect(json).not.toHaveProperty("guildId")
})

test("Unicode, static, animated and unavailable reaction emoji format correctly", () => {
    const client = new DiscordRestClient()
    expect(new Emoji(client, { id: null, name: "🔥" }).toString()).toBe("🔥")
    expect(new Emoji(client, emojiData).toString()).toBe(`<:Wave:${emojiId}>`)
    expect(new Emoji(client, { ...emojiData, animated: true }).toString()).toBe(`<a:Wave:${emojiId}>`)
    const deleted = new Emoji(client, { id: emojiId, name: null })
    expect(deleted.toString()).toBe(`<:_:${emojiId}>`)
    expect(deleted.name).toBeNull()
    expect(deleted.user).toBeUndefined()
    expect(deleted.available).toBeUndefined()
    expect(new Emoji(client, { id: null, name: null }).toString()).toBe("")
})

test.each(["jpeg", "png", "gif", "webp", "avif"])(
    "emoji data supports %s without broadening avatar types",
    (format) => {
        const uri = `data:image/${format};base64,AQ==`
        expect(ImageDataManager.isEmojiImageData(uri)).toBe(true)
        expect(ImageDataManager.getEmojiImageDataSize(uri)).toBe(1)
        expect(ImageDataManager.isImageData(uri)).toBe(["jpeg", "png", "gif"].includes(format))
    },
)

test.each(["", "AQ=", "A===", "A", "AAAA=", "AQ===", "A Q==", "AQ--", "AB==", "AAB=", "AQ==\n", "AQ==AA=="])(
    "malformed base64 is rejected: %s",
    (payload) => {
        expect(ImageDataManager.isEmojiImageData(`data:image/png;base64,${payload}`)).toBe(false)
    },
)

test("valid padding lengths yield exact decoded sizes", () => {
    expect(ImageDataManager.getEmojiImageDataSize("data:image/png;base64,AQ==")).toBe(1)
    expect(ImageDataManager.getEmojiImageDataSize("data:image/png;base64,AQI=")).toBe(2)
    expect(ImageDataManager.getEmojiImageDataSize("data:image/png;base64,AQID")).toBe(3)
    expect(ImageDataManager.isEmojiImageData("data:text/plain;base64,AQ==")).toBe(false)
    expect(ImageDataManager.isEmojiImageData(null)).toBe(false)
})

test("image upload accepts exactly 256 KiB and rejects the next byte", () => {
    const limit = `data:image/avif;base64,${Buffer.alloc(256 * 1024).toString("base64")}`
    expect(ImageDataManager.getEmojiImageDataSize(limit)).toBe(262144)
    expect(() => assertEmojiImage(limit)).not.toThrow()
    expect(() => assertEmojiImage(`data:image/png;base64,${Buffer.alloc(256 * 1024 + 1).toString("base64")}`)).toThrow(
        RangeError,
    )
    expect(() => assertEmojiImage("data:image/png;base64,")).toThrow(TypeError)
})
