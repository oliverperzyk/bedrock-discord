import js from "@eslint/js"
import globals from "globals"
import tseslint from "typescript-eslint"
import json from "@eslint/json"
import markdown from "@eslint/markdown"
import { defineConfig } from "eslint/config"

/**
 * @summary ESLint configuration.
 * @description Configuration of the API application.
 * @see {@link https://eslint.org/docs/latest/use/configure/configuration-files}
 */
export default defineConfig([
    tseslint.configs.recommended,
    {
        ignores: ["node_modules/**", "dist/**", "./tsconfig*.json"],
    },
    {
        files: ["**/*.ts"],
        plugins: { js },
        extends: ["js/recommended"],
        languageOptions: {
            globals: globals.node,
        },
    },
    {
        files: ["**/*.json"],
        plugins: { json },
        language: "json/json",
        extends: ["json/recommended"],
    },
    {
        files: ["**/*.jsonc"],
        plugins: { json },
        language: "json/jsonc",
        extends: ["json/recommended"],
    },
    {
        files: ["**/*.json5"],
        plugins: { json },
        language: "json/json5",
        extends: ["json/recommended"],
    },
    {
        files: ["**/*.md"],
        plugins: { markdown },
        language: "markdown/gfm",
        extends: ["markdown/recommended"],
    },
])
