/**
 * @summary A single cache record.
 * @description Holds a stored value and an optional absolute expiry time in Unix milliseconds.
 * @template T - The type of the cached value.
 */
interface ICacheEntry<T = unknown> {
    /**
     * @summary Cached value.
     * @description The data stored for a namespace and key.
     */
    readonly value: T
    /**
     * @summary Expiry timestamp.
     * @description Unix time in milliseconds after which the entry is stale, or `null` when the entry does not expire.
     */
    readonly expiresAt: number | null
}

export type { ICacheEntry }
