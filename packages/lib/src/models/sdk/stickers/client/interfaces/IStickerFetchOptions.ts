import type { IResourceFetchOptions } from "../../../client/interfaces/IResourceFetchOptions"

/**
 * @summary Sticker fetch controls.
 * @description Backwards-compatible specialization of the shared REST cache controls.
 */
interface IStickerFetchOptions extends IResourceFetchOptions {
    /**
     * @summary Cache participation.
     * @description Defaults to true; false bypasses cache reads and writes.
     */
    readonly cache?: boolean
    /**
     * @summary Force refresh.
     * @description Defaults to false; true skips cached reads while respecting cache writes.
     */
    readonly force?: boolean
}

export type { IStickerFetchOptions }
