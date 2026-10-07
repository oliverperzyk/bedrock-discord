/**
 * @summary REST resource fetch controls.
 * @description Controls cache reads and writes within a DiscordRestClient instance.
 */
interface IResourceFetchOptions {
    /**
     * @summary Cache participation.
     * @description Defaults to true; false skips cache reads and writes.
     */
    readonly cache?: boolean
    /**
     * @summary Forced refresh.
     * @description Defaults to false; true skips cache reads but still writes when caching is enabled.
     */
    readonly force?: boolean
}

export type { IResourceFetchOptions }
