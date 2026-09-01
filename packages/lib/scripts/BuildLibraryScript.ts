/// <reference types="bun" />

import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

/**
 * @summary Library build script.
 * @description Bundles the library source into `dist/index.js`.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
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
            await Bun.write(output.path, this.removeSourcePathComments(this.restoreComments(await output.text())))
        }
    }

    /**
     * @summary Marks comments as legal comments.
     * @description Bun keeps `/*!` and `//!` comments and strips the rest.
     */
    private static markCommentsAsLegal(source: string): string {
        return source
            .replaceAll("/**", "/*!*")
            .replace(/\/\*(?!\!)/g, "/*!")
            .replace(/(^|[^:])\/\/(?![\/!])/gm, "$1//!")
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
}
