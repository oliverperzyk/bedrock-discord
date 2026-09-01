/**
 * @summary Entrypoint of the application.
 * @description Initializes the application and starts the server.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
class Main {
    /**
     * @summary Private constructor.
     * @description Prevents instantiation of the class.
     */
    private constructor() {}

    /**
     * @summary Static initializer.
     * @description Initializes the application and starts the server.
     */
    static {
        void this.init()
    }

    /**
     * @summary Initializes the application and starts the server.
     */
    private static async init(): Promise<void> {
        console.log("Hello, world!")
    }
}