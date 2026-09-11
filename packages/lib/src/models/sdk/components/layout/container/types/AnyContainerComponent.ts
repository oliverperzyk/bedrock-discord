import type { TextDisplay } from "../../../../../../sdk/components/display/TextDisplay"
import type { ActionRow } from "../../../../../../sdk/components/layout/ActionRow"
import type { MediaGallery } from "../../../../../../sdk/components/layout/MediaGallery"

/**
 * @summary Component that can live in a container.
 * @description Union of builders accepted by {@link Container}. Action rows, media galleries, and text displays; sections, separators, and files will be added here as they land.
 */
type AnyContainerComponent = ActionRow | MediaGallery | TextDisplay

export type { AnyContainerComponent }
