import type { NodeEnvironment } from "@/oliverperzyk/models/globals/environment/NodeEnvironment"
import { EnvironmentVariablesDataManager } from "./managers/security/EnvironmentVariablesDataManager"

/**
 * @summary Class for environment variables.
 * @description This class is used to get the environment variables.
 */
class EnvironmentVariables {
    /**
     * @summary Private constructor.
     * @description Prevents instanization & inheritance.
     */
    private constructor() {}

    /**
     * @summary The port of the application.
     * @description Port that application will run on.
     */
    public static readonly APP_PORT: number = EnvironmentVariablesDataManager.getPort("APP_PORT", true)

    /**
     * @summary The node environment.
     * @description Environment that node is running in.
     */
    public static readonly NODE_ENV: NodeEnvironment = EnvironmentVariablesDataManager.getNodeEnvironment()
}

export { EnvironmentVariables }
