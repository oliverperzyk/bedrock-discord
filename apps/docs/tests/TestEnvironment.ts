/**
 * @summary Test environment for the library.
 * @description A class that initializes the test environment for the library.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class TestEnvironment {
    /**
     * @summary Private constructor.
     * @description Prevents instantiation & inheritance of the class.
     */
    private constructor() {}

    /**
     * @summary Static initializer.
     * @description Initializes the test environment.
     */
    static {
        void this.init()
    }

    /**
     * @summary Initializes the test environment.
     */
    private static async init(): Promise<void> {}
}
