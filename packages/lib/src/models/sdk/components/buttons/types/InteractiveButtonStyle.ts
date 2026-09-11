import type { ButtonStyle } from "../enums/ButtonStyle"

/**
 * @summary Interactive button style.
 * @description Button styles that require `custom_id` and cannot use `url` or `sku_id`.
 */
type InteractiveButtonStyle = ButtonStyle.PRIMARY | ButtonStyle.SECONDARY | ButtonStyle.SUCCESS | ButtonStyle.DANGER

export type { InteractiveButtonStyle }
