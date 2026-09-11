import type { BaseButton } from "../../../../../../sdk/components/buttons/base/BaseButton"
import type { BaseDropdown } from "../../../../../../sdk/components/dropdowns/base/BaseDropdown"

/**
 * @summary Component that can live in an action row.
 * @description Union of builders accepted by {@link ActionRow}. Buttons and select menus; text inputs will be added here as they land.
 */
type AnyActionRowComponent = BaseButton | BaseDropdown

export type { AnyActionRowComponent }
