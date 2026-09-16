import type { Snowflake } from "../../../data/snowflakes/types/Snowflake"

/**
 * @summary Query params for webhook message endpoints.
 * @description Optional `thread_id` and `with_components` for get/edit/delete webhook message routes. Mapped to Discord snake_case when building the URL.
 */
interface IWebhookMessageQuery {
    /**
     * @summary Thread snowflake.
     * @description Id of the thread the message is in, when the message lives in a thread.
     */
    readonly threadId?: Snowflake
    /**
     * @summary Whether to respect `components` on edit.
     * @description When `true`, non-application-owned webhooks may send non-interactive components. Defaults to `false` on Discord when omitted. Only used by edit webhook message.
     */
    readonly withComponents?: boolean
}

export type { IWebhookMessageQuery }
