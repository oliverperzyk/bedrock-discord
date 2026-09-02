import type { NextConfig } from "next"
import { join } from "path"

/**
 * @summary Configuration of Next.js.
 * @description This file is used to configure documentation's website configuration of a framework.
 * @see {@link https://nextjs.org/docs/app/api-reference/config/next-config-js}
 */
export default {
    typedRoutes: true,
    reactCompiler: true,
    reactStrictMode: true,
    turbopack: {
        root: join(import.meta.dirname, "../.."),
    },
    async redirects() {
        return [
            {
                source: "/repository",
                destination: "https://github.com/oliverperzyk/bedrock-discord",
                permanent: true,
            },
            {
                source: "/issues",
                destination: "https://github.com/oliverperzyk/bedrock-discord/issues",
                permanent: true,
            },
            {
                source: "/github",
                destination: "https://github.com/oliverperzyk/bedrock-discord",
                permanent: true,
            },
            {
                source: "/funding",
                destination: "https://oliverperzyk.com/funding",
                permanent: true
            }
        ]
    },
} satisfies NextConfig
