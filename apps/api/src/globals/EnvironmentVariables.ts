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
}

export { EnvironmentVariables }
