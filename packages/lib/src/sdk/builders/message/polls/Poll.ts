import { PollLayoutType } from "../../../../models/sdk/messages/polls/enums/PollLayoutType"
import { PollAnswer } from "./PollAnswer"

/**
 * @summary Discord poll create request builder.
 * @description Builds a [poll create request](https://docs.discord.com/developers/resources/poll#poll-create-request-object) for messages and webhooks. Holds a question, 1–10 answers, and optional duration, multiselect, and layout.
 * @example
 * ```ts
 * const poll: Poll = new Poll()
 *     .setQuestion("Pick a class")
 *     .setDuration(24)
 *     .addAnswers(
 *         new PollAnswer().setText("Warrior").setEmoji({ name: "⚔️" }),
 *         new PollAnswer().setText("Mage"),
 *     )
 * ```
 */
class Poll {
    /**
     * @summary Maximum length of question text.
     * @description Discord caps poll question `text` at 300 characters.
     */
    private static readonly MAX_QUESTION_LENGTH: number = 300

    /**
     * @summary Maximum number of answers.
     * @description Discord allows at most 10 answers on a poll.
     */
    private static readonly MAX_ANSWERS: number = 10

    /**
     * @summary Maximum poll duration in hours.
     * @description Discord allows up to 32 days (`768` hours).
     */
    private static readonly MAX_DURATION_HOURS: number = 768

    /**
     * @summary Poll question text.
     * @description Required when serializing. Must be 1–300 characters.
     */
    private question?: string

    /**
     * @summary Poll answers.
     * @description Answer builders shown to the user. At least one and at most 10 when serializing.
     */
    private answers: PollAnswer[] = []

    /**
     * @summary Poll duration in hours.
     * @description How long the poll stays open. Discord defaults to `24` when omitted. Must be 1–768.
     */
    private duration?: number

    /**
     * @summary Whether multiple answers can be selected.
     * @description Discord defaults this to `false` when omitted.
     */
    private allowMultiselect?: boolean

    /**
     * @summary Poll layout type.
     * @description Currently only {@link PollLayoutType.DEFAULT}. Omitted from the payload when unset.
     */
    private layoutType?: PollLayoutType

    /**
     * @summary Creates a poll create request builder.
     * @description Starts with no question or answers. Set a question and add at least one {@link PollAnswer} before sending.
     */
    public constructor() {}

    /**
     * @summary Gets the question text.
     * @description Returns the question string, or `undefined` when unset.
     * @returns The question text, or `undefined` if unset.
     */
    public getQuestion(): string | undefined {
        return this.question
    }

    /**
     * @summary Sets the question text.
     * @description Poll question shown to users. Must be 1–300 characters. Serializes as `question: { text }`.
     * @param question - Question text.
     * @returns This poll for chaining.
     */
    public setQuestion(question: string): this {
        this.question = Poll.assertQuestion(question)
        return this
    }

    /**
     * @summary Gets the poll answers.
     * @description Returns a copy of the {@link PollAnswer} builders currently on this poll.
     * @returns The answers in insertion order.
     */
    public getAnswers(): PollAnswer[] {
        return this.answers.slice()
    }

    /**
     * @summary Appends poll answers.
     * @description Adds {@link PollAnswer} builders to the end of the list. Combined length cannot exceed 10.
     * @param answers - Answers to append.
     * @returns This poll for chaining.
     */
    public addAnswers(...answers: PollAnswer[]): this {
        this.answers = Poll.assertAnswers(this.answers.concat(answers))
        return this
    }

    /**
     * @summary Replaces all poll answers.
     * @description Overwrites the answer list. Pass 1–10 answers before serializing.
     * @param answers - Answers that become the full list.
     * @returns This poll for chaining.
     */
    public setAnswers(...answers: PollAnswer[]): this {
        this.answers = Poll.assertAnswers(answers)
        return this
    }

    /**
     * @summary Gets the poll duration.
     * @description Returns duration in hours, or `undefined` when Discord should use the default of `24`.
     * @returns The duration in hours, or `undefined` if unset.
     */
    public getDuration(): number | undefined {
        return this.duration
    }

    /**
     * @summary Sets the poll duration.
     * @description Number of hours the poll stays open. Must be an integer from 1 to 768 (32 days).
     * @param duration - Duration in hours.
     * @returns This poll for chaining.
     */
    public setDuration(duration: number): this {
        this.duration = Poll.assertDuration(duration)
        return this
    }

    /**
     * @summary Gets whether multiple answers are allowed.
     * @description Returns the multiselect flag, or `undefined` when omitted from the payload.
     * @returns Whether multiselect is allowed, or `undefined` if unset.
     */
    public getAllowMultiselect(): boolean | undefined {
        return this.allowMultiselect
    }

    /**
     * @summary Sets whether multiple answers are allowed.
     * @description Discord defaults to `false` when this field is omitted.
     * @param allowMultiselect - Whether a user can select multiple answers.
     * @returns This poll for chaining.
     */
    public setAllowMultiselect(allowMultiselect: boolean): this {
        this.allowMultiselect = allowMultiselect
        return this
    }

    /**
     * @summary Gets the layout type.
     * @description Returns the layout, or `undefined` when unset.
     * @returns The layout type, or `undefined` if unset.
     */
    public getLayoutType(): PollLayoutType | undefined {
        return this.layoutType
    }

    /**
     * @summary Sets the layout type.
     * @description Currently only {@link PollLayoutType.DEFAULT} is valid.
     * @param layoutType - Poll layout type.
     * @returns This poll for chaining.
     */
    public setLayoutType(layoutType: PollLayoutType): this {
        this.layoutType = Poll.assertLayoutType(layoutType)
        return this
    }

    /**
     * @summary Converts the poll to a JSON object.
     * @description Builds a Discord poll create request with required `question` and `answers`, plus optional `duration`, `allow_multiselect`, and `layout_type`.
     * @returns The JSON object representation of the poll create request.
     */
    public toJSON(): Record<string, unknown> {
        const answers: PollAnswer[] = Poll.assertAnswers(this.answers, true)
        const payload: Record<string, unknown> = {
            question: { text: Poll.assertQuestion(this.question) },
            answers: answers.map((answer: PollAnswer) => answer.toJSON()),
        }
        if (this.duration !== undefined) payload.duration = this.duration
        if (this.allowMultiselect !== undefined) payload.allow_multiselect = this.allowMultiselect
        if (this.layoutType !== undefined) payload.layout_type = this.layoutType
        return payload
    }

    /**
     * @summary Validates question text.
     * @description Ensures the question is a string of 1–300 characters.
     * @param question - Candidate question.
     * @returns The validated question.
     */
    private static assertQuestion(question: string | undefined): string {
        if (typeof question !== "string") throw new TypeError("Poll question must be a string.")
        if (question.length < 1 || question.length > Poll.MAX_QUESTION_LENGTH) {
            throw new RangeError("Poll question must be between 1 and 300 characters.")
        }
        return question
    }

    /**
     * @summary Validates poll duration.
     * @description Ensures the value is an integer from 1 to 768 hours.
     * @param duration - Candidate duration in hours.
     * @returns The validated duration.
     */
    private static assertDuration(duration: number): number {
        if (!Number.isInteger(duration) || duration < 1 || duration > Poll.MAX_DURATION_HOURS) {
            throw new RangeError("Poll duration must be an integer between 1 and 768 hours.")
        }
        return duration
    }

    /**
     * @summary Validates poll layout type.
     * @description Ensures the value is {@link PollLayoutType.DEFAULT}.
     * @param layoutType - Candidate layout.
     * @returns The validated layout.
     */
    private static assertLayoutType(layoutType: PollLayoutType): PollLayoutType {
        if (layoutType !== PollLayoutType.DEFAULT) {
            throw new RangeError("Poll layout_type must be PollLayoutType.DEFAULT.")
        }
        return layoutType
    }

    /**
     * @summary Validates poll answers.
     * @description Ensures children are {@link PollAnswer} builders and the list stays within Discord's 1–10 limit.
     * @param answers - Candidate answers.
     * @param requireNonEmpty - When `true`, rejects an empty list (used when serializing).
     * @returns The validated answer list.
     */
    private static assertAnswers(answers: readonly PollAnswer[], requireNonEmpty: boolean = false): PollAnswer[] {
        if (!Array.isArray(answers)) throw new TypeError("Poll answers must be an array.")
        if (requireNonEmpty && answers.length < 1) {
            throw new RangeError("Poll must contain at least 1 answer.")
        }
        if (answers.length > Poll.MAX_ANSWERS) {
            throw new RangeError("Poll can contain at most 10 answers.")
        }
        for (const answer of answers) {
            if (!(answer instanceof PollAnswer)) {
                throw new TypeError("Poll answers must be PollAnswer builders.")
            }
        }
        return answers.slice()
    }
}

export { Poll }
