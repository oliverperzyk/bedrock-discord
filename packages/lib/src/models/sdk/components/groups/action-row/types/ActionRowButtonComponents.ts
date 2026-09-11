/**
 * @summary Action row filled with buttons.
 * @description One to five contextually grouped buttons. Buttons cannot be mixed with a select or a text input in the same row.
 */
type ActionRowButtonComponents<TButton> =
    | [TButton]
    | [TButton, TButton]
    | [TButton, TButton, TButton]
    | [TButton, TButton, TButton, TButton]
    | [TButton, TButton, TButton, TButton, TButton]

export type { ActionRowButtonComponents }
