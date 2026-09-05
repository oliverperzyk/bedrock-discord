/**
 * @summary Enum for the node environment.
 * @description This enum is used to define the environment that application is running in.
 */
const enum NodeEnvironment {
    /**
     * @summary Development environment.
     * @description Environment for development purposes.
     */
    DEVELOPMENT = "development",
    /**
     * @summary Production environment.
     * @description Environment for production purposes.
     */
    PRODUCTION = "production",
    /**
     * @summary Test environment.
     * @description Environment for testing purposes.
     */
    TEST = "test",
}

export { NodeEnvironment }
