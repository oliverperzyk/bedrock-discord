import type { PollAnswerEmoji } from "../../../../models/sdk/messages/polls/types/PollAnswerEmoji"

/**
 * @summary Single answer in a poll create request.
 * @description Nested poll answer payload. Holds answer text and an optional emoji. Place answers on {@link Poll}.
 * @example
 * ```ts
 * const answer: PollAnswer = new PollAnswer()
 *     .setText("Warrior")
 *     .setEmoji({ name: "⚔️" })
 * ```
 */
class PollAnswer {
    /**
     * @summary Maximum length of answer text.
     * @description Discord caps poll answer `text` at 55 characters.
     */
    private static readonly MAX_TEXT_LENGTH: number = 55

    /**
     * @summary Answer text.
     * @description Text shown for this answer. Required when serializing. At most 55 characters.
     */
    private text?: string

    /**
     * @summary Optional answer emoji.
     * @description Custom emoji `id` or unicode emoji `name`. Omitted from the payload when unset.
     */
    private emoji?: PollAnswerEmoji

    /**
     * @summary Creates a poll answer.
     * @description Starts with no text or emoji. Set text with {@link PollAnswer.setText} before sending.
     */
    public constructor() {}

    /**
     * @summary Gets the answer text.
     * @description Returns the answer text, or `undefined` when unset.
     * @returns The answer text, or `undefined` if unset.
     */
    public getText(): string | undefined {
        return this.text
    }

    /**
     * @summary Sets the answer text.
     * @description Text shown for this answer. Must be 1–55 characters.
     * @param text - Answer text.
     * @returns This answer for chaining.
     */
    public setText(text: string): this {
        this.text = PollAnswer.assertText(text)
        return this
    }

    /**
     * @summary Gets the answer emoji.
     * @description Returns the emoji, or `undefined` when unset.
     * @returns The emoji, or `undefined` if unset.
     */
    public getEmoji(): PollAnswerEmoji | undefined {
        return this.emoji
    }

    /**
     * @summary Sets the answer emoji.
     * @description Pass either `{ id }` for a custom emoji or `{ name }` for a unicode emoji.
     * @param emoji - Custom emoji id or unicode emoji name.
     * @returns This answer for chaining.
     */
    public setEmoji(emoji: PollAnswerEmoji): this {
        this.emoji = PollAnswer.assertEmoji(emoji)
        return this
    }

    /**
     * @summary Converts the answer to a JSON object.
     * @description Builds a Discord poll answer with required `poll_media.text` and optional `poll_media.emoji`. Does not include `answer_id`.
     * @returns The JSON object representation of the answer.
     */
    public toJSON(): Record<string, unknown> {
        const pollMedia: Record<string, unknown> = {
            text: PollAnswer.assertText(this.text),
        }
        if (this.emoji !== undefined) pollMedia.emoji = this.emoji
        return { poll_media: pollMedia }
    }

    /**
     * @summary Validates answer text.
     * @description Ensures the text is a string of 1–55 characters.
     * @param text - Candidate text.
     * @returns The validated text.
     */
    private static assertText(text: string | undefined): string {
        if (typeof text !== "string") throw new TypeError("Poll answer text must be a string.")
        if (text.length < 1 || text.length > PollAnswer.MAX_TEXT_LENGTH) {
            throw new RangeError("Poll answer text must be between 1 and 55 characters.")
        }
        return text
    }

    /**
     * @summary Validates answer emoji.
     * @description Ensures the value is either `{ id: string }` or `{ name: string }` with a non-empty name.
     * @param emoji - Candidate emoji.
     * @returns The validated emoji.
     */
    private static assertEmoji(emoji: PollAnswerEmoji): PollAnswerEmoji {
        if (emoji === null || typeof emoji !== "object") {
            throw new TypeError("Poll answer emoji must be an object with id or name.")
        }
        if ("id" in emoji && "name" in emoji) {
            throw new TypeError("Poll answer emoji must have either id or name, not both.")
        }
        if ("id" in emoji) {
            if (typeof emoji.id !== "string" || emoji.id.length < 1) {
                throw new TypeError("Poll answer emoji id must be a non-empty string.")
            }
            return { id: emoji.id }
        }
        if (!("name" in emoji) || typeof emoji.name !== "string" || emoji.name.length < 1) {
            throw new TypeError("Poll answer emoji name must be a non-empty string.")
        }
        return { name: emoji.name }
    }
}

export { PollAnswer }
export type { PollAnswerEmoji }
