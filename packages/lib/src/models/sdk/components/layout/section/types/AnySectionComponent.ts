import type { TextDisplay } from "../../../../../../sdk/builders/components/display/TextDisplay"

/**
 * @summary Component that can live in a section.
 * @description Union of builders accepted as {@link Section} children. Currently text displays; Discord may allow other content components later.
 */
type AnySectionComponent = TextDisplay

export type { AnySectionComponent }
