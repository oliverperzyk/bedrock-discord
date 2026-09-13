import type { BaseDropdown } from "../../../../../../sdk/components/dropdowns/base/BaseDropdown"
import type { Checkbox } from "../../../../../../sdk/components/input/checkboxes/Checkbox"
import type { CheckboxGroup } from "../../../../../../sdk/components/input/checkboxes/CheckboxGroup"
import type { RadioGroup } from "../../../../../../sdk/components/input/radio/RadioGroup"
import type { TextInput } from "../../../../../../sdk/components/input/TextInput"

/**
 * @summary Component that can live in a label.
 * @description Union of builders accepted as the single child of {@link Label}. Text inputs, select menus, radio groups, checkbox groups, and checkboxes. File uploads will be added here as they land.
 */
type AnyLabelComponent = BaseDropdown | Checkbox | CheckboxGroup | RadioGroup | TextInput

export type { AnyLabelComponent }
