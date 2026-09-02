import { EnvironmentVariableError } from "@/oliverperzyk/models/builders/process-errors/EnvironmentVariableError"
import { env } from "bun"

/**
 * @summary Manager class for environment variables data.
 * @description This class is used to get the data of the environment variables.
 */
class EnvironmentVariablesDataManager {
    /**
     * @summary Private constructor.
     * @description Prevents instanization & inheritance.
     */
    private constructor() {}

    /**
     * @summary Gets a string environment variable.
     * @param variableName - The name of the environment variable.
     * @param required - Whether the environment variable is required.
     * @returns The value of the environment variable.
     */
    public static getString<T extends boolean>(variableName: string, required: T): T extends true ? string : string | undefined {
        const value: string | undefined = env[variableName]
        if (!value && required) throw EnvironmentVariableError.fromMissingVariable(variableName)
        return value as T extends true ? string : string | undefined
    }

    /**
     * @summary Gets a number environment variable.
     * @param variableName - The name of the environment variable.
     * @param required - Whether the environment variable is required.
     * @returns The value of the environment variable.
     */
    public static getNumber<T extends boolean>(variableName: string, required: T): T extends true ? number : number | undefined {
        const value: string | undefined = env[variableName]
        if (!value) {
            if (required) throw EnvironmentVariableError.fromMissingVariable(variableName)
            return undefined as T extends true ? number : number | undefined
        }

        const parsedValue: number = Number.parseFloat(value)
        if (Number.isNaN(parsedValue)) throw EnvironmentVariableError.fromInvalidNumberValue(variableName)
        return parsedValue
    }

    /**
     * @summary Gets a port environment variable.
     * @param variableName - The name of the environment variable.
     * @param required - Whether the environment variable is required.
     * @returns The value of the environment variable.
     */
    public static getPort<T extends boolean>(variableName: string, required: T): T extends true ? number : number | undefined {
        const value: string | undefined = env[variableName]
        if (!value) {
            if (required) throw EnvironmentVariableError.fromMissingVariable(variableName)
            return undefined as T extends true ? number : number | undefined
        }

        const parsedValue: number = Number.parseInt(value)
        if (Number.isNaN(parsedValue)) throw EnvironmentVariableError.fromInvalidNumberValue(variableName)
        if (parsedValue < 1 || parsedValue > 65535) throw EnvironmentVariableError.fromInvalidPortValue(variableName)
        return parsedValue
    }

    /**
     * @summary Gets a boolean environment variable.
     * @param variableName - The name of the environment variable.
     * @param required - Whether the environment variable is required.
     * @returns The value of the environment variable.
     */
    public static getBoolean<T extends boolean>(variableName: string, required: T): T extends true ? boolean : boolean | undefined {
        const value: string | undefined = env[variableName]
        if (!value) {
            if (required) throw EnvironmentVariableError.fromMissingVariable(variableName)
            return undefined as T extends true ? boolean : boolean | undefined
        }
        
        switch (value.toLowerCase().trim()) {
            case "true":
                return true
            case "false":
                return false
            default:
                throw EnvironmentVariableError.fromInvalidBooleanValue(variableName)
        }
    }
}

export { EnvironmentVariablesDataManager }
