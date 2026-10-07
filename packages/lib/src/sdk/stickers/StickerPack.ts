import type { Snowflake } from "../../models/sdk/data/snowflakes/types/Snowflake"
import type { IStickerPack } from "../../models/sdk/stickers/base/interfaces/IStickerPack"
import type { IStickerPacksResponse } from "../../models/sdk/stickers/client/interfaces/IStickerPacksResponse"
import type { IStickerFetchOptions } from "../../models/sdk/stickers/client/interfaces/IStickerFetchOptions"
import { DiscordRestClient } from "../client/DiscordRestClient"
import { Routes } from "../globals/Routes"
import { Sticker } from "./Sticker"

/**
 * @summary Represents a standard sticker pack.
 * @description Hydrates pack metadata and nested Sticker instances using a shared REST client.
 * @example
 * ```ts
 * const client = new DiscordRestClient().setToken("bot-token")
 * const packs = await StickerPack.fetchAll(client)
 * console.warn(packs?.[0]?.stickers[0]?.name)
 * ```
 */
class StickerPack {
    /**
     * @summary Pack contents.
     * @description Readonly array of hydrated standard stickers sharing this pack's client.
     */
    public readonly stickers: readonly Sticker[]

    /**
     * @summary Creates a pack snapshot.
     * @description Hydrates the API payload without issuing a request.
     * @param client - Shared authenticated REST client.
     * @param data - Discord pack wire data.
     */
    public constructor(
        public readonly client: DiscordRestClient,
        private readonly data: IStickerPack,
    ) {
        this.stickers = data.stickers.map((sticker) => new Sticker(client, sticker))
    }

    /**
     * @summary Pack identifier.
     * @description Snowflake identifying this resource.
     */
    public get id(): Snowflake {
        return this.data.id
    }

    /**
     * @summary Display name.
     * @description Title shown in the sticker store.
     */
    public get name(): string {
        return this.data.name
    }

    /**
     * @summary Store product.
     * @description SKU associated with this pack.
     */
    public get skuId(): Snowflake {
        return this.data.sku_id
    }

    /**
     * @summary Cover sticker.
     * @description Optional sticker used as the pack icon.
     */
    public get coverStickerId(): Snowflake | undefined {
        return this.data.cover_sticker_id
    }

    /**
     * @summary Pack description.
     * @description Text describing this collection.
     */
    public get description(): string {
        return this.data.description
    }

    /**
     * @summary Banner artwork.
     * @description Optional asset identifier for the pack banner.
     */
    public get bannerAssetId(): Snowflake | undefined {
        return this.data.banner_asset_id
    }

    /**
     * @summary Lists available packs.
     * @description Calls GET /sticker-packs and unwraps the sticker_packs response field.
     * @param client - Shared authenticated REST client.
     * @param options - Cache controls.
     * @returns Hydrated packs, including an empty array, or null on request failure.
     */
    public static fetchAll(
        client: DiscordRestClient,
        options: IStickerFetchOptions = {},
    ): Promise<readonly StickerPack[] | null> {
        const url = Routes.getStickerPacks()
        return client.fetchResource(
            url,
            async () => {
                const response = await client.get<IStickerPacksResponse>(url)
                return response.success
                    ? response.data.sticker_packs.map((pack) => new StickerPack(client, pack))
                    : null
            },
            options,
        )
    }

    /**
     * @summary Gets a pack by ID.
     * @description Calls GET /sticker-packs/{id} and hydrates its nested stickers.
     * @param client - Shared authenticated REST client.
     * @param id - Pack snowflake.
     * @param options - Cache controls.
     * @returns A pack snapshot, or null on request failure.
     */
    public static fetch(
        client: DiscordRestClient,
        id: Snowflake,
        options: IStickerFetchOptions = {},
    ): Promise<StickerPack | null> {
        const url = Routes.getStickerPack(id)
        return client.fetchResource(
            url,
            async () => {
                const response = await client.get<IStickerPack>(url)
                return response.success ? new StickerPack(client, response.data) : null
            },
            options,
        )
    }

    /**
     * @summary Refreshes this pack.
     * @description Returns a snapshot from the pack endpoint using the supplied cache controls.
     * @param options - Cache controls.
     * @returns A pack snapshot, or null on request failure.
     */
    public fetch(options: IStickerFetchOptions = {}): Promise<StickerPack | null> {
        return StickerPack.fetch(this.client, this.id, options)
    }
}

export { StickerPack }
