import type { IWelcomeScreenChannel } from "./IWelcomeScreenChannel"

/**
 * @summary Community guild welcome screen.
 * @description Description and featured channels shown to new members, including on some invite payloads.
 */
interface IWelcomeScreen {
    /**
     * @summary Welcome description.
     * @description Server description shown on the welcome screen, or `null` when unset.
     */
    readonly description: string | null
    /**
     * @summary Featured channels.
     * @description Up to five channels listed on the welcome screen.
     */
    readonly welcomeChannels: readonly IWelcomeScreenChannel[]
}

export type { IWelcomeScreen }
