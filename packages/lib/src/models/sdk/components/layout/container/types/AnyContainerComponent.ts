import type { File } from "../../../../../../sdk/builders/components/display/File"
import type { Separator } from "../../../../../../sdk/builders/components/display/Separator"
import type { TextDisplay } from "../../../../../../sdk/builders/components/display/TextDisplay"
import type { ActionRow } from "../../../../../../sdk/builders/components/layout/ActionRow"
import type { MediaGallery } from "../../../../../../sdk/builders/components/layout/MediaGallery"
import type { Section } from "../../../../../../sdk/builders/components/layout/Section"

/**
 * @summary Component that can live in a container.
 * @description Union of builders accepted by {@link Container}: action rows, text displays, sections, media galleries, separators, and files.
 */
type AnyContainerComponent = ActionRow | File | MediaGallery | Section | Separator | TextDisplay

export type { AnyContainerComponent }
