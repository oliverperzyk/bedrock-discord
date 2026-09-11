import type { BaseButton } from "../../../../../../sdk/components/buttons/base/BaseButton"

/**
 * @summary Component that can live in an action row.
 * @description Union of builders accepted by {@link ActionRow}. Currently buttons; select menus and text inputs will be added here as they land.
 */
type AnyActionRowComponent = BaseButton

export type { AnyActionRowComponent }
