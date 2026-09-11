import type { TextDisplay } from "../../../../../../sdk/components/display/TextDisplay"
import type { ActionRow } from "../../../../../../sdk/components/layout/ActionRow"
import type { MediaGallery } from "../../../../../../sdk/components/layout/MediaGallery"
import type { Section } from "../../../../../../sdk/components/layout/Section"

/**
 * @summary Component that can live in a container.
 * @description Union of builders accepted by {@link Container}. Action rows, media galleries, sections, and text displays; separators and files will be added here as they land.
 */
type AnyContainerComponent = ActionRow | MediaGallery | Section | TextDisplay

export type { AnyContainerComponent }
