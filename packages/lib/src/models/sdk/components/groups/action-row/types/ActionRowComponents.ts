import type { ActionRowButtonComponents } from "./ActionRowButtonComponents"
import type { ActionRowSelectComponents } from "./ActionRowSelectComponents"
import type { ActionRowTextInputComponents } from "./ActionRowTextInputComponents"
import type { AnyActionRowComponent } from "./AnyActionRowComponent"

/**
 * @summary Valid children for an action row of a given component type.
 * @description Buttons allow one to five of the same kind. A select or a deprecated text input must be the only child in the row.
 */
type ActionRowComponents<TComponent extends AnyActionRowComponent> =
    | ActionRowButtonComponents<TComponent>
    | ActionRowSelectComponents<TComponent>
    | ActionRowTextInputComponents<TComponent>

export type { ActionRowComponents }
