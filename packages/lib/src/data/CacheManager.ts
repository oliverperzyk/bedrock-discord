import type { ICacheEntry } from "../models/data/cache/interfaces/ICacheEntry"

/**
 * @summary In-memory cache for Discord API resources.
 * @description Instance-bound store used by library APIs to reuse fetched entities without extra HTTP calls. The namespace is fixed at construction so guilds, channels, and other resources do not share keys. Entries may optionally expire after a TTL. This does not persist across script reloads.
 * @example
 * ```ts
 * const guilds = new CacheManager("guilds")
 * guilds.set(guild.id, guild)
 * const cached = guilds.get<typeof guild>(guild.id)
 *
 * const guild = await guilds.getOrFetch(id, async () => fetchGuild(id), 60_000)
 * ```
 */
class CacheManager {
    /**
     * @summary Cache stores by namespace.
     * @description Shared maps so every `CacheManager` constructed with the same namespace reads and writes the same entries.
     */
    private static readonly STORES: Map<string, Map<string, ICacheEntry>> = new Map()

    /**
     * @summary Store namespace.
     * @description Resource kind this instance caches, such as `guilds` or `channels`.
     */
    public readonly namespace: string

    /**
     * @summary Creates a cache for one resource kind.
     * @description Binds this instance to `namespace`. Other instances with the same namespace share the same underlying store.
     * @param namespace - Store name, typically a resource kind such as `guilds`.
     */
    public constructor(namespace: string) {
        this.namespace = namespace
    }

    /**
     * @summary Reads a cached value.
     * @description Returns `undefined` when the key is missing or the entry has expired. Expired entries are removed as part of the read.
     * @template T - The expected type of the cached value.
     * @param key - Unique id within the namespace, usually a snowflake.
     * @returns The cached value, or `undefined`.
     */
    public get<T>(key: string): T | undefined {
        const store: Map<string, ICacheEntry> | undefined = CacheManager.STORES.get(this.namespace)
        if (store === undefined) {
            return undefined
        }

        const entry: ICacheEntry | undefined = store.get(key)
        if (entry === undefined) {
            return undefined
        }

        if (this.isExpired(entry)) {
            store.delete(key)
            return undefined
        }

        return entry.value as T
    }

    /**
     * @summary Writes a cached value.
     * @description Replaces any existing entry for the same key. A non-positive TTL removes the key instead of storing it.
     * @template T - The type of the value to store.
     * @param key - Unique id within the namespace, usually a snowflake.
     * @param value - The value to cache.
     * @param ttlMilliseconds - Optional lifetime from now; omit for an entry that does not expire.
     */
    public set<T>(key: string, value: T, ttlMilliseconds?: number): void {
        if (ttlMilliseconds !== undefined && ttlMilliseconds <= 0) {
            this.delete(key)
            return
        }

        const store: Map<string, ICacheEntry> = this.getStore()
        const expiresAt: number | null = ttlMilliseconds === undefined ? null : Date.now() + ttlMilliseconds

        const entry: ICacheEntry<T> = {
            value,
            expiresAt,
        }

        store.set(key, entry)
    }

    /**
     * @summary Checks whether a live entry exists.
     * @description Expired entries are treated as missing and are removed.
     * @param key - Unique id within the namespace, usually a snowflake.
     * @returns `true` when a non-expired entry exists.
     */
    public has(key: string): boolean {
        return this.get(key) !== undefined
    }

    /**
     * @summary Removes one cached entry.
     * @description No-op when the key is not present.
     * @param key - Unique id within the namespace, usually a snowflake.
     * @returns `true` when an entry was removed.
     */
    public delete(key: string): boolean {
        const store: Map<string, ICacheEntry> | undefined = CacheManager.STORES.get(this.namespace)
        if (store === undefined) {
            return false
        }

        return store.delete(key)
    }

    /**
     * @summary Clears this namespace.
     * @description Drops every entry stored under this instance's namespace. Other namespaces are left unchanged.
     */
    public clear(): void {
        CacheManager.STORES.delete(this.namespace)
    }

    /**
     * @summary Counts live entries in this namespace.
     * @description Expired entries are swept first so the result only includes usable values.
     * @returns The number of non-expired entries.
     */
    public size(): number {
        this.sweep()
        const store: Map<string, ICacheEntry> | undefined = CacheManager.STORES.get(this.namespace)
        return store === undefined ? 0 : store.size
    }

    /**
     * @summary Drops expired entries in this namespace.
     * @description Leaves non-expired entries in place. Removes the store entirely when it becomes empty.
     * @returns The number of entries removed.
     */
    public sweep(): number {
        const store: Map<string, ICacheEntry> | undefined = CacheManager.STORES.get(this.namespace)
        if (store === undefined) {
            return 0
        }

        let removed: number = 0
        for (const [key, entry] of store) {
            if (this.isExpired(entry)) {
                store.delete(key)
                removed += 1
            }
        }

        if (store.size === 0) {
            CacheManager.STORES.delete(this.namespace)
        }

        return removed
    }

    /**
     * @summary Returns a cached value or loads it.
     * @description On a cache miss, runs `fetch`, stores the result, and returns it. Failed fetches are not cached.
     * @template T - The type of the value.
     * @param key - Unique id within the namespace, usually a snowflake.
     * @param fetch - Producer called when the cache has no live entry.
     * @param ttlMilliseconds - Optional lifetime applied when storing a fetched value.
     * @returns The cached or freshly fetched value.
     */
    public async getOrFetch<T>(key: string, fetch: () => Promise<T>, ttlMilliseconds?: number): Promise<T> {
        const cached: T | undefined = this.get<T>(key)
        if (cached !== undefined) {
            return cached
        }

        const value: T = await fetch()
        this.set(key, value, ttlMilliseconds)
        return value
    }

    /**
     * @summary Resolves this namespace store.
     * @description Creates an empty map the first time the namespace is used.
     * @returns The map for this instance's namespace.
     */
    private getStore(): Map<string, ICacheEntry> {
        let store: Map<string, ICacheEntry> | undefined = CacheManager.STORES.get(this.namespace)
        if (store === undefined) {
            store = new Map()
            CacheManager.STORES.set(this.namespace, store)
        }

        return store
    }

    /**
     * @summary Whether an entry is past its TTL.
     * @description Entries with `expiresAt` of `null` never expire.
     * @param entry - The cache record to inspect.
     * @returns `true` when the entry should be discarded.
     */
    private isExpired(entry: ICacheEntry): boolean {
        return entry.expiresAt !== null && entry.expiresAt <= Date.now()
    }
}

export { CacheManager }
