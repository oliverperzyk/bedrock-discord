/**
 * @summary StickerFormatType.
 * @description Numeric values used by Discord sticker resources.
 */
enum StickerFormatType {
    /**
     * @summary PNG sticker.
     * @description Static PNG image.
     */
    PNG = 1,
    /**
     * @summary APNG sticker.
     * @description Animated PNG image.
     */
    APNG = 2,
    /**
     * @summary LOTTIE sticker.
     * @description Lottie JSON animation.
     */
    LOTTIE = 3,
    /**
     * @summary GIF sticker.
     * @description Animated GIF image.
     */
    GIF = 4,
}

export { StickerFormatType }
