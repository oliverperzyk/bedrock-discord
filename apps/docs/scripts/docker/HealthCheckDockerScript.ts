import { exit } from "process"

/**
 * @summary Health check script for the Docker container.
 * @description A script that checks the health of the documentation application's Docker container.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class HealthCheckDockerScript {
    /**
     * @summary Private constructor.
     * @description Prevents instantiation & inheritance.
     */
    private constructor() {}

    /**
     * @summary Static initializer.
     * @description Initializes the health check script.
     */
    static {
        void this.init()
    }

    /**
     * @summary Gets the port of the application.
     * @description Retrieves the port of the application.
     * @default 3000
     */
    private static get APP_PORT(): number {
        try {
            return parseInt(process.env.APP_PORT ?? "3000")
        } catch {
            return 3000
        }
    }

    /**
     * @summary Initializes the health check script.
     * @description Checks whether the documentation application is running properly on a specific port.
     */
    private static async init(): Promise<void> {
        try {
            const response: Response = await fetch(`http://localhost:${this.APP_PORT}`)
            exit(Number(!response.ok))
        } catch {
            exit(1)
        }
    }
}
