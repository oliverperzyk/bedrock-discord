/**
 * @summary Discord button style.
 * @description Visual style and field set for a button; link and premium styles require `url` or `sku_id` instead of `custom_id`.
 */
enum ButtonStyle {
    /**
     * @summary Primary button.
     * @description The most important or recommended action in a group. Requires `custom_id`.
     */
    PRIMARY = 1,
    /**
     * @summary Secondary button.
     * @description Alternative or supporting actions. Requires `custom_id`.
     */
    SECONDARY = 2,
    /**
     * @summary Success button.
     * @description Positive confirmation or completion actions. Requires `custom_id`.
     */
    SUCCESS = 3,
    /**
     * @summary Danger button.
     * @description An action with irreversible consequences. Requires `custom_id`.
     */
    DANGER = 4,
    /**
     * @summary Link button.
     * @description Navigates to a URL and does not send an interaction. Requires `url`.
     */
    LINK = 5,
    /**
     * @summary Premium button.
     * @description Purchase flow for a SKU and does not send an interaction. Requires `sku_id`.
     */
    PREMIUM = 6,
}

export { ButtonStyle }
