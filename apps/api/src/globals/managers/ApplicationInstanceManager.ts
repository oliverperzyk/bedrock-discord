import type { Express } from "express"
import express from "express"
import cors from "cors"

/**
 * @summary Singleton manager for the Express application instance.
 * @description This manager is responsible for creating and managing the Express application instance.
 */
class ApplicationInstanceManager {
    /**
     * @summary Private constructor.
     * @description Prevents instanization & inheritance.
     */
    private constructor() {}

    /**
     * @summary Internal instance of the Express application.
     * @description Resolved later by getter method.
     */
    private static internalInstance: Express | null = null

    /**
     * @summary Getter method for the Express application instance.
     * @description Returns the internal instance of the Express application.
     */
    public static get instance(): Express {
        if (this.internalInstance === null) {
            this.internalInstance = express()
            this.internalInstance.use(
                cors({
                    optionsSuccessStatus: 204,
                    allowedHeaders: ["Content-Type", "Authorization"],
                    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
                    credentials: true,
                    origin: "*",
                }),
            )
        }

        return this.internalInstance
    }
}

export { ApplicationInstanceManager }
