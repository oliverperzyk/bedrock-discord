import json from "@eslint/json"
import markdown from "@eslint/markdown"
import { defineConfig } from "eslint/config"

/**
 * @summary ESLint configuration.
 * @description Configuration of the root repository of library.
 * @see {@link https://eslint.org/docs/latest/use/configure/configuration-files}
 */
export default defineConfig([
    {
        // Apps & packages directories are ignored as they do have their own ESLint configuration.
        ignores: ["packages/**", "apps/**", "node_modules/**", "dist/**"],
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
