/**
 * @summary Custom error class for environment variable errors.
 * @description This error class is used to throw errors when environment variables are missing or invalid.
 */
class EnvironmentVariableError extends Error {
    /**
     * @summary Constructor for the EnvironmentVariableError class.
     * @description Initializes the error with the given message and variable name.
     * @param message - The message of the error.
     * @param variableName - The name of the environment variable that caused the error.
     */
    public constructor(
        public override readonly message: string,
        public readonly variableName: string,
    ) {
        super(message)
        this.name = "EnvironmentVariableError"
        Object.setPrototypeOf(this, EnvironmentVariableError.prototype)
    }

    /**
     * @summary Creates an error fof a missing environment variable.
     * @param variableName - The name of the environment variable that is missing.
     * @returns A new EnvironmentVariableError instance.
     */
    public static fromMissingVariable(variableName: string): EnvironmentVariableError {
        return new EnvironmentVariableError(`The environment variable "${variableName}" is missing.`, variableName)
    }
    
    /**
     * @summary Creates an error for an invalid number value.
     * @param variableName - The name of the environment variable that is invalid.
     * @returns A new EnvironmentVariableError instance.
     */
    public static fromInvalidNumberValue(variableName: string): EnvironmentVariableError {
        return new EnvironmentVariableError(`The environment variable "${variableName}" is not a valid number.`, variableName)
    }

    /**
     * @summary Creates an error for an invalid port value.
     * @param variableName - The name of the environment variable that is invalid.
     * @returns A new EnvironmentVariableError instance.
     */
    public static fromInvalidPortValue(variableName: string): EnvironmentVariableError {
        return new EnvironmentVariableError(`The environment variable "${variableName}" is not a valid port.`, variableName)
    }

    /**
     * @summary Creates an error for an invalid boolean value.
     * @param variableName - The name of the environment variable that is invalid.
     * @returns A new EnvironmentVariableError instance.
     */
    public static fromInvalidBooleanValue(variableName: string): EnvironmentVariableError {
        return new EnvironmentVariableError(`The environment variable "${variableName}" is not a valid boolean.`, variableName)
    }
}

export { EnvironmentVariableError }
