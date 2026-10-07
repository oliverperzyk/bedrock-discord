/**
 * @summary Sticker fetch controls.
 * @description Controls client-local cache reads and writes for sticker resources.
 */
interface IStickerFetchOptions {
    /**
     * @summary Cache participation.
     * @description Defaults to true; false bypasses cache reads and writes.
     */
    readonly cache?: boolean
    /**
     * @summary Force refresh.
     * @description Defaults to false; true bypasses cache reads while respecting cache writes.
     */
    readonly force?: boolean
}

export type { IStickerFetchOptions }
