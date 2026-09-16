import type { BaseButton } from "../../../../../../sdk/builders/components/buttons/base/BaseButton"
import type { SectionAccessory } from "../../../../../../sdk/builders/components/display/SectionAccessory"

/**
 * @summary Component that can be a section accessory.
 * @description Union of builders accepted by {@link Section.setAccessory}. Buttons today; {@link SectionAccessory} covers thumbnail-style accessories as they land.
 */
type AnySectionAccessory = BaseButton | SectionAccessory

export type { AnySectionAccessory }
