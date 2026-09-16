import type { Snowflake } from "../../../data/snowflakes/types/Snowflake"

/**
 * @summary Emoji on a poll answer.
 * @description When creating a poll answer, Discord accepts either a custom emoji `id` or a unicode emoji `name`, not both.
 */
type PollAnswerEmoji = { readonly id: Snowflake } | { readonly name: string }

export type { PollAnswerEmoji }
