/// <reference types="bun" />

import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

/**
 * @summary Library build script.
 * @description Bundles the library source into `dist/index.js`.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class BuildLibraryScript {
    /**
     * @summary Private constructor.
     * @description Prevents instantiation & inheritance of the class.
     */
    private constructor() {}

    /**
     * @summary The root directory of the package.
     */
    private static readonly PACKAGE_ROOT: string = join(dirname(fileURLToPath(import.meta.url)), "..")

    /**
     * @summary Names that open a `(` but are not function declarations.
     * @description Prevents treating `if`, loops, and similar headers as methods when hoisting JSDoc.
     */
    private static readonly FUNCTION_CONTROL_NAMES: ReadonlySet<string> = new Set([
        "if",
        "for",
        "while",
        "switch",
        "catch",
        "with",
    ])

    /**
     * @summary Static initializer.
     * @description Starts the build process.
     */
    static {
        void this.init()
    }

    /**
     * @summary Bundles the library.
     */
    private static async init(): Promise<void> {
        const result: Awaited<ReturnType<typeof Bun.build>> = await Bun.build({
            entrypoints: [join(this.PACKAGE_ROOT, "src", "index.ts")],
            outdir: join(this.PACKAGE_ROOT, "dist"),
            target: "browser",
            format: "esm",
            naming: "index.js",
            minify: false,
            // Exclude Minecraft's dependencies as they're just
            // minor types and not needed in the library.
            external: ["@minecraft/server", "@minecraft/server-net"],
            plugins: [
                {
                    name: "keep-comments",
                    setup(build: Bun.PluginBuilder): void {
                        build.onLoad(
                            { filter: /\/src\/.+\.[cm]?[jt]s$/ },
                            async (args: Bun.OnLoadArgs): Promise<Bun.OnLoadResult> => {
                                const source: string = await Bun.file(args.path).text()

                                return {
                                    contents: BuildLibraryScript.markCommentsAsLegal(source),
                                    loader:
                                        args.path.endsWith(".ts") ||
                                        args.path.endsWith(".mts") ||
                                        args.path.endsWith(".cts")
                                            ? "ts"
                                            : "js",
                                }
                            },
                        )
                    },
                },
            ],
        })

        if (!result.success) {
            for (const log of result.logs) {
                console.error(log)
            }

            process.exit(1)
        }

        for (const output of result.outputs) {
            const bundled: string = this.removeSourcePathComments(this.restoreComments(await output.text()))
            await Bun.write(output.path, this.relocateComments(bundled))
        }
    }

    /**
     * @summary Marks comments as legal comments.
     * @description Bun keeps `/*!` and `//!` comments and strips the rest.
     */
    private static markCommentsAsLegal(source: string): string {
        return source
            .replaceAll("/**", "/*!*")
            .replace(/\/\*(?!!)/g, "/*!")
            .replace(/(^|[^:])\/\/(?![/!])/gm, "$1//!")
    }

    /**
     * @summary Restores comments after bundling.
     */
    private static restoreComments(source: string): string {
        return source.replaceAll("/*!*", "/**").replaceAll("/*!", "/*").replaceAll("//!", "//")
    }

    /**
     * @summary Removes Bun source path comments.
     * @description Drops lines such as `// src/index.ts` that Bun inserts into the bundle.
     */
    private static removeSourcePathComments(source: string): string {
        return source
            .split("\n")
            .filter((line: string): boolean => !line.trim().startsWith("// src/"))
            .join("\n")
    }

    /**
     * @summary Reattaches surviving JSDoc after Bun’s TypeScript lowering.
     * @description Hoists method docs out of function bodies, drops comments for erased declarations, and normalizes star indentation.
     */
    private static relocateComments(source: string): string {
        return this.normalizeJsdocIndent(this.dropOrphanJsdocs(this.hoistFunctionJsdocs(source)))
    }

    /**
     * @summary Moves method JSDoc above the function.
     * @description Bun leaves leading JSDoc inside the body. The last block is the function’s own comment; earlier blocks documented erased fields.
     */
    private static hoistFunctionJsdocs(source: string): string {
        const lines: string[] = source.split("\n")
        const output: string[] = []
        let index: number = 0

        while (index < lines.length) {
            const header: ReturnType<typeof BuildLibraryScript.readFunctionHeader> = this.readFunctionHeader(
                lines,
                index,
            )
            if (header === null) {
                output.push(lines[index] as string)
                index += 1
                continue
            }

            const headerLines: string[] = lines.slice(header.start, header.end + 1)
            const bodyStart: number = header.end + 1
            const leading: ReturnType<typeof BuildLibraryScript.readLeadingJsdocs> = this.readLeadingJsdocs(
                lines,
                bodyStart,
            )
            const keeper: string[] | undefined = leading.blocks.at(-1)

            if (keeper !== undefined) {
                output.push(...this.formatJsdoc(keeper, header.indent))
            }
            output.push(...headerLines)

            const openHeader: string = headerLines[headerLines.length - 1] as string
            const extraOpen: number = (openHeader.match(/\{/g) ?? []).length - (openHeader.match(/\}/g) ?? []).length
            const bodyEnd: number = this.findMatchingBrace(lines, leading.nextIndex, extraOpen)
            const remainder: string[] = lines.slice(leading.nextIndex, bodyEnd + 1)
            output.push(...remainder)
            index = bodyEnd + 1
        }

        return output.join("\n")
    }

    /**
     * @summary Drops JSDoc that no longer sits on a declaration.
     * @description Keeps a block only when the next non-comment token is a class, function, method, binding, or value export.
     */
    private static dropOrphanJsdocs(source: string): string {
        const lines: string[] = source.split("\n")
        const output: string[] = []
        let index: number = 0

        while (index < lines.length) {
            if (!this.isJsdocStart(lines[index] as string)) {
                output.push(lines[index] as string)
                index += 1
                continue
            }

            const blockEnd: number = this.findJsdocEnd(lines, index)
            const block: string[] = lines.slice(index, blockEnd + 1)
            let cursor: number = blockEnd + 1
            while (cursor < lines.length && lines[cursor]?.trim() === "") {
                cursor += 1
            }

            const follower: string = lines[cursor] ?? ""
            if (this.isDeclarationLine(follower)) {
                output.push(...block)
            }

            index = blockEnd + 1
        }

        return output.join("\n")
    }

    /**
     * @summary Aligns JSDoc stars with the following declaration.
     * @description Rewrites each kept block so `*` lines use the declaration indent instead of leftover class-member indent.
     */
    private static normalizeJsdocIndent(source: string): string {
        const lines: string[] = source.split("\n")
        const output: string[] = []
        let index: number = 0

        while (index < lines.length) {
            if (!this.isJsdocStart(lines[index] as string)) {
                output.push(lines[index] as string)
                index += 1
                continue
            }

            const blockEnd: number = this.findJsdocEnd(lines, index)
            const block: string[] = lines.slice(index, blockEnd + 1)
            let cursor: number = blockEnd + 1
            while (cursor < lines.length && lines[cursor]?.trim() === "") {
                cursor += 1
            }

            const indent: string = /^(\s*)/.exec(lines[cursor] ?? "")?.[1] ?? ""
            output.push(...this.formatJsdoc(block, indent))
            index = blockEnd + 1
        }

        return output.join("\n")
    }

    /**
     * @summary Reads a function header starting at a line.
     * @description Accepts constructors and `static` / `async` / getter methods, including multi-line parameter lists.
     */
    private static readFunctionHeader(
        lines: readonly string[],
        start: number,
    ): { readonly start: number; readonly end: number; readonly indent: string } | null {
        const first: string = lines[start] as string
        const match: RegExpExecArray | null =
            /^(\s*)(?:static\s+)?(?:async\s+)?(?:get\s+|set\s+)?([A-Za-z_$][\w$]*)\s*\(/.exec(first)
        if (match === null) return null

        const name: string = match[2] as string
        if (this.FUNCTION_CONTROL_NAMES.has(name)) return null

        let parenDepth: number = 0
        let seenOpenParen: boolean = false
        for (let index: number = start; index < lines.length; index += 1) {
            const line: string = lines[index] as string
            for (const character of line) {
                if (character === "(") {
                    seenOpenParen = true
                    parenDepth += 1
                } else if (character === ")") {
                    parenDepth -= 1
                }
            }
            if (!seenOpenParen || parenDepth > 0) continue
            if (!/\{\s*$/.test(line)) return null
            return { start, end: index, indent: match[1] as string }
        }

        return null
    }

    /**
     * @summary Collects JSDoc blocks at the start of a function body.
     * @description Skips blank lines between blocks. `nextIndex` is the first body line that is not leading JSDoc.
     */
    private static readLeadingJsdocs(
        lines: readonly string[],
        start: number,
    ): { readonly blocks: string[][]; readonly nextIndex: number } {
        const blocks: string[][] = []
        let index: number = start

        while (index < lines.length) {
            if (lines[index]?.trim() === "") {
                index += 1
                continue
            }
            if (!this.isJsdocStart(lines[index] as string)) break
            const end: number = this.findJsdocEnd(lines, index)
            blocks.push(lines.slice(index, end + 1))
            index = end + 1
        }

        return { blocks, nextIndex: index }
    }

    /**
     * @summary Finds the line that closes a `{` opened by a function header.
     * @description Tracks brace depth from the first body line, starting with the header’s unmatched opens.
     */
    private static findMatchingBrace(lines: readonly string[], bodyStart: number, initialDepth: number): number {
        let depth: number = initialDepth
        for (let index: number = bodyStart; index < lines.length; index += 1) {
            const line: string = this.stripLineCommentsAndStrings(lines[index] as string)
            for (const character of line) {
                if (character === "{") depth += 1
                if (character === "}") depth -= 1
            }
            if (depth <= 0) return index
        }
        return lines.length - 1
    }

    /**
     * @summary Rewrites a JSDoc block to a given indent.
     * @description Emits an opening JSDoc fence, ` *` content lines, and a closer using `indent`.
     */
    private static formatJsdoc(block: readonly string[], indent: string): string[] {
        const inner: string[] = []
        for (const line of block) {
            const trimmed: string = line.trim()
            if (trimmed.startsWith("/**")) {
                const afterOpen: string = trimmed
                    .slice(3)
                    .replace(/\*\/\s*$/, "")
                    .trim()
                if (afterOpen.length > 0 && afterOpen !== "*") inner.push(afterOpen.replace(/^\*\s?/, ""))
                continue
            }
            if (trimmed.endsWith("*/")) {
                const beforeClose: string = trimmed
                    .slice(0, -2)
                    .trim()
                    .replace(/^\*\s?/, "")
                if (beforeClose.length > 0) inner.push(beforeClose)
                continue
            }
            inner.push(trimmed.replace(/^\*\s?/, ""))
        }

        const formatted: string[] = [`${indent}/**`]
        for (const line of inner) {
            formatted.push(line.length > 0 ? `${indent} * ${line}` : `${indent} *`)
        }
        formatted.push(`${indent} */`)
        return formatted
    }

    /**
     * @summary Whether a line opens a JSDoc block.
     * @description True when the line begins a JSDoc comment after optional whitespace.
     */
    private static isJsdocStart(line: string): boolean {
        return /^\s*\/\*\*/.test(line)
    }

    /**
     * @summary Finds the last line of a JSDoc block.
     * @description Scans forward from `start` until a line that closes the block comment.
     */
    private static findJsdocEnd(lines: readonly string[], start: number): number {
        for (let index: number = start; index < lines.length; index += 1) {
            if ((lines[index] as string).includes("*/")) return index
        }
        return start
    }

    /**
     * @summary Whether a line can own a JSDoc comment.
     * @description `export {` re-export lists are excluded so module banners before the bundle export are dropped.
     */
    private static isDeclarationLine(line: string): boolean {
        const trimmed: string = line.trim()
        if (trimmed.length < 1) return false
        if (/^export\s*\{/.test(trimmed)) return false
        if (/^export\s+/.test(trimmed)) return true
        if (/^(?:async\s+)?function\b/.test(trimmed)) return true
        if (/^class\b/.test(trimmed)) return true
        if (/^(?:const|let|var)\b/.test(trimmed)) return true
        if (/^constructor\s*\(/.test(trimmed)) return true
        return /^(?:static\s+)?(?:async\s+)?(?:get\s+|set\s+)?[A-Za-z_$][\w$]*\s*\(/.test(trimmed)
    }

    /**
     * @summary Strips strings and line comments for brace counting.
     * @description Avoids treating `{` / `}` inside quotes or `//` tails as scope delimiters.
     */
    private static stripLineCommentsAndStrings(line: string): string {
        let result: string = ""
        let quote: string | null = null
        for (let index: number = 0; index < line.length; index += 1) {
            const character: string = line[index] as string
            const previous: string = line[index - 1] as string
            if (quote === null && character === "/" && line[index + 1] === "/") break
            if (quote === null && (character === '"' || character === "'" || character === "`")) {
                quote = character
                continue
            }
            if (quote !== null) {
                if (character === quote && previous !== "\\") quote = null
                continue
            }
            result += character
        }
        return result
    }
}
