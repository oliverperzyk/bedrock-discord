/**
 * @summary Separator padding size.
 * @description Size of vertical padding around a separator. Discord defaults to small when `spacing` is omitted.
 */
enum SeparatorSpacingSize {
    /**
     * @summary Small padding.
     * @description Compact vertical space between surrounding components.
     */
    SMALL = 1,
    /**
     * @summary Large padding.
     * @description Extra vertical space between surrounding components.
     */
    LARGE = 2,
}

export { SeparatorSpacingSize }
