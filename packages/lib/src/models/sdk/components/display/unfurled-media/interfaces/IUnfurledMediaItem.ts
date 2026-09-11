/**
 * @summary Unfurled media item sent to Discord.
 * @description Request shape for media used in content components. Only `url` is settable; Discord fills proxy URL, dimensions, and related fields on the response.
 */
interface IUnfurledMediaItem {
    /**
     * @summary Media URL.
     * @description Arbitrary HTTPS URL or an `attachment://filename` reference to an uploaded file.
     */
    readonly url: string
}

export type { IUnfurledMediaItem }
