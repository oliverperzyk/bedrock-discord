/**
 * @summary Guild incident action timestamps.
 * @description ISO8601 times for paused invites, paused DMs, and detected raid or DM-spam events.
 */
interface IIncidentsData {
    /**
     * @summary Invites resume at.
     * @description When invites become enabled again, or `null` if they are not paused.
     */
    readonly invitesDisabledUntil: string | null
    /**
     * @summary Direct messages resume at.
     * @description When direct messages become enabled again, or `null` if they are not paused.
     */
    readonly dmsDisabledUntil: string | null
    /**
     * @summary DM spam detected at.
     * @description When DM spam was detected, if Discord recorded that event.
     */
    readonly dmSpamDetectedAt?: string | null
    /**
     * @summary Raid detected at.
     * @description When a raid was detected, if Discord recorded that event.
     */
    readonly raidDetectedAt?: string | null
}

export type { IIncidentsData }
