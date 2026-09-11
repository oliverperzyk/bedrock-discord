/**
 * @summary Action row filled with a select menu.
 * @description Exactly one string, user, role, mentionable, or channel select. A select cannot share a row with buttons or a text input.
 */
type ActionRowSelectComponents<TSelect> = [TSelect]

export type { ActionRowSelectComponents }
