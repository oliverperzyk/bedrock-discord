import { ButtonStyle } from "../../../../models/sdk/components/buttons/enums/ButtonStyle"
import type { Snowflake } from "../../../../models/sdk/data/snowflakes/types/Snowflake"
import { BaseButton } from "../base/BaseButton"

/**
 * @summary Premium Discord button.
 * @description Purchase button bound to a SKU. Requires `sku_id` and cannot have `custom_id`, `label`, `url`, or `emoji`.
 * @example
 * ```ts
 * const button = new PremiumButton("123456789012345678" as Snowflake).setDisabled(false)
 * ```
 */
class PremiumButton extends BaseButton {
    /**
     * @summary Purchasable SKU identifier.
     * @description Snowflake of the SKU this premium button sells. Required and exclusive to premium style.
     */
    private skuId?: Snowflake

    /**
     * @summary Creates a premium button.
     * @description Requires a SKU snowflake. Style is always `ButtonStyle.PREMIUM`.
     * @param skuId - Identifier of the purchasable SKU.
     */
    public constructor() {
        super()
    }

    /**
     * @summary Gets the SKU identifier.
     * @description Snowflake of the purchasable SKU attached to this button.
     * @returns The SKU identifier.
     */
    public getSkuId(): Snowflake | undefined {
        return this.skuId
    }

    /**
     * @summary Sets the SKU identifier.
     * @description Replaces `sku_id` for this premium button.
     * @param skuId - Identifier of the purchasable SKU.
     * @returns This button for chaining.
     */
    public setSkuId(skuId: Snowflake): this {
        this.skuId = PremiumButton.assertSkuId(skuId)
        return this
    }

    /**
     * @summary Gets the button style.
     * @description Premium buttons always use `ButtonStyle.PREMIUM`.
     * @returns The premium button style.
     */
    public getStyle(): ButtonStyle.PREMIUM {
        return ButtonStyle.PREMIUM
    }

    /**
     * @summary Converts the button to a JSON object.
     * @description Builds a Discord button payload with `sku_id` and premium style.
     * @returns The JSON object representation of the button.
     */
    public toJSON(): Record<string, unknown> {
        return {
            ...this.toBaseJSON(),
            style: ButtonStyle.PREMIUM,
            sku_id: PremiumButton.assertSkuId(this.skuId),
        }
    }

    /**
     * @summary Validates a SKU identifier.
     * @description Ensures `sku_id` is a non-empty snowflake string.
     * @param skuId - Candidate SKU identifier.
     * @returns The validated SKU identifier.
     */
    private static assertSkuId(skuId: Snowflake | undefined): Snowflake {
        if (skuId === undefined || typeof skuId !== "string" || skuId.length === 0) {
            throw new TypeError("Premium button sku_id must be a non-empty snowflake.")
        }

        return skuId
    }
}

export { PremiumButton }
