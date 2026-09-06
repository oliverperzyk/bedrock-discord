import type { ReactNode } from "react"

/**
 * @summary Represents the children of a component.
 * @description Base interface that contains the children of a component.
 */
interface IChildren {
    /**
     * @summary The children of the component.
     * @description Children of the component.
     */
    readonly children: ReactNode
}

export type { IChildren }
