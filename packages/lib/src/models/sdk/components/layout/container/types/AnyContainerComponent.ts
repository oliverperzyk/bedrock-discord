import type { ActionRow } from "../../../../../../sdk/components/layout/ActionRow"

/**
 * @summary Component that can live in a container.
 * @description Union of builders accepted by {@link Container}. Action rows; text displays, sections, media galleries, separators, and files will be added here as they land.
 */
type AnyContainerComponent = ActionRow

export type { AnyContainerComponent }
