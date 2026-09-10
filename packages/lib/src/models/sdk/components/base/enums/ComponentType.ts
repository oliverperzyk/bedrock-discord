/**
 * @summary Discord component type.
 * @description Discriminator for layout, content, and interactive components on messages and modals.
 */
enum ComponentType {
    /**
     * @summary Action row.
     * @description Layout container for a row of interactive components. Used in messages; up to five buttons or a single select.
     */
    ACTION_ROW = 1,
    /**
     * @summary Button.
     * @description Interactive button object. Used in messages.
     */
    BUTTON = 2,
    /**
     * @summary String select menu.
     * @description Interactive select menu for picking from defined text options. Used in messages and modals.
     */
    STRING_SELECT_MENU = 3,
    /**
     * @summary Text input.
     * @description Interactive text input object. Used in modals.
     */
    TEXT_INPUT = 4,
    /**
     * @summary User select menu.
     * @description Interactive select menu for picking users. Used in messages and modals.
     */
    USER_SELECT_MENU = 5,
    /**
     * @summary Role select menu.
     * @description Interactive select menu for picking roles. Used in messages and modals.
     */
    ROLE_SELECT_MENU = 6,
    /**
     * @summary Mentionable select menu.
     * @description Interactive select menu for picking mentionables (users and roles). Used in messages and modals.
     */
    MENTIONABLE_SELECT_MENU = 7,
    /**
     * @summary Channel select menu.
     * @description Interactive select menu for picking channels. Used in messages and modals.
     */
    CHANNEL_SELECT_MENU = 8,
    /**
     * @summary Section.
     * @description Layout container that displays text alongside an accessory component. Used in messages.
     */
    SECTION = 9,
    /**
     * @summary Text display.
     * @description Content component for markdown text. Used in messages and modals.
     */
    TEXT_DISPLAY = 10,
    /**
     * @summary Thumbnail.
     * @description Content component for a small image used as an accessory. Used in messages.
     */
    THUMBNAIL = 11,
    /**
     * @summary Media gallery.
     * @description Content component that displays images and other media. Used in messages.
     */
    MEDIA_GALLERY = 12,
    /**
     * @summary File.
     * @description Content component that displays an attached file. Used in messages.
     */
    FILE = 13,
    /**
     * @summary Separator.
     * @description Layout component that adds vertical padding between other components. Used in messages.
     */
    SEPARATOR = 14,
    /**
     * @summary Container.
     * @description Layout container that visually groups a set of components. Used in messages.
     */
    CONTAINER = 17,
    /**
     * @summary Label.
     * @description Layout container associating a label and description with a component. Used in modals.
     */
    LABEL = 18,
    /**
     * @summary File upload.
     * @description Interactive component for uploading files. Used in modals.
     */
    FILE_UPLOAD = 19,
    /**
     * @summary Radio group.
     * @description Interactive single-choice set of options. Used in modals.
     */
    RADIO_GROUP = 21,
    /**
     * @summary Checkbox group.
     * @description Interactive multi-selectable group of checkboxes. Used in modals.
     */
    CHECKBOX_GROUP = 22,
    /**
     * @summary Checkbox.
     * @description Interactive single checkbox for a yes/no choice. Used in modals.
     */
    CHECKBOX = 23,
}

export { ComponentType }
