import type { BaseDropdown } from "../../../../../../sdk/builders/components/dropdowns/base/BaseDropdown"
import type { Checkbox } from "../../../../../../sdk/builders/components/input/checkboxes/Checkbox"
import type { CheckboxGroup } from "../../../../../../sdk/builders/components/input/checkboxes/CheckboxGroup"
import type { RadioGroup } from "../../../../../../sdk/builders/components/input/radio/RadioGroup"
import type { TextInput } from "../../../../../../sdk/builders/components/input/TextInput"

/**
 * @summary Component that can live in a label.
 * @description Union of builders accepted as the single child of {@link Label}. Text inputs, select menus, radio groups, checkbox groups, and checkboxes. File uploads will be added here as they land.
 */
type AnyLabelComponent = BaseDropdown | Checkbox | CheckboxGroup | RadioGroup | TextInput

export type { AnyLabelComponent }
