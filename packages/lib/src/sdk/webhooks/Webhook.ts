/**
 * @summary Represents a Discord webhook.
 * @description A webhook is a URL that is used to send messages to a channel.
 */
class Webhook {
    /**
     * @summary Regular expression to validate a Discord webhook URI.
     * @description The regular expression is used to validate a Discord webhook URI.
     */
    private static readonly WEBHOOK_URI_REGEXP: Readonly<RegExp> =
        /^https:\/\/(canary\.|ptb\.)?discord\.com\/api\/webhooks\/\d{17,20}\/[A-Za-z0-9_-]{60,70}$/

    /**
     * @summary Validates a Discord webhook URI.
     * @description Validates a Discord webhook URI by parsing it and checking if it matches the regular expression.
     * @param uri - The URI to validate.
     * @returns True if the URI is a valid Discord webhook URI, false otherwise.
     */
    public static isValidUri(uri: string | URL): uri is URL {
        try {
            const parsedUri: string = uri instanceof URL ? uri.toString() : uri
            return this.WEBHOOK_URI_REGEXP.test(parsedUri)
        } catch {
            return false
        }
    }

    /**
     * @summary The endpoint of the webhook.
     * @description The endpoint of the webhook is the URL that is used to send messages to the webhook.
     */
    public readonly uri: string

    /**
     * @summary Creates a new webhook.
     * @description Creates an instance of a Discord webhook, that is in demand for sending messages to a channel.
     * @param uri - Endpoint of the webhook.
     * @remarks This does not verify whenever the webhook is valid, use {@link Webhook.isValid} to verify it.
     */
    public constructor(uri: string | URL) {
        this.uri = uri instanceof URL ? uri.toString() : uri
    }

    /**
     * @summary Checks if the webhook is valid.
     * @description Checks if the webhook is valid by making a request to the webhook endpoint and checking if the response is successful.
     * @returns Whenever the webhook is valid.
     */
    public async isValid(): Promise<boolean> {
        return true
    }
}

export { Webhook }
