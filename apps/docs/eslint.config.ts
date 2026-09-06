import js from "@eslint/js"
import globals from "globals"
import tseslint from "typescript-eslint"
import json from "@eslint/json"
import markdown from "@eslint/markdown"
import css from "@eslint/css"
import react from "eslint-plugin-react"
import { defineConfig } from "eslint/config"

/**
 * @summary ESLint configuration.
 * @description Configuration of the documentation application.
 * @see {@link https://eslint.org/docs/latest/use/configure/configuration-files}
 */
export default defineConfig([
    tseslint.configs.recommended,
    {
        files: ["**/*.ts", "**/*.tsx"],
        ...react.configs.flat.recommended,
        settings: {
            react: {
                version: "19.2.4",
            },
        },
    },
    {
        files: ["**/*.ts", "**/*.tsx"],
        ...react.configs.flat["jsx-runtime"],
    },
    {
        ignores: ["node_modules/**", "dist/**", ".next/**", "out/**", "build/**", "/next-env.d.ts"],
    },
    {
        files: ["**/*.ts", "**/*.tsx"],
        plugins: { js },
        extends: ["js/recommended"],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        rules: {
            // These rules are disabled as they wrongly flag TypeScript-only features
            // (e.g. enumerations, union types, namespaces) as unused or undefined.
            "no-unused-vars": "off",
            "no-undef": "off",
        },
    },
    {
        ignores: ["./tsconfig.json", "./tsconfig.test.json"],
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
    {
        files: ["**/*.css"],
        plugins: { css },
        language: "css/css",
        extends: ["css/recommended"],
        rules: {
            "css/no-invalid-at-rules": "off",
        },
    },
])
