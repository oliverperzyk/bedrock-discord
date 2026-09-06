import localFont from "next/font/local"

/**
 * @summary Mojangles font.
 * @description This font is used to display Mojangles text. Mostly paragraphs.
 */
export const MOJANGLES = localFont({
    src: "../../public/assets/fonts/Mojangles.ttf",
    variable: "--font-mojangles-face",
    display: "swap",
})

/**
 * @summary Minecraft Five font.
 * @description This font is used to display Minecraft Five text. Mostly text.
 */
export const MINECRAFT_FIVE = localFont({
    src: "../../public/assets/fonts/MinecraftFive.ttf",
    variable: "--font-minecraft-five-face",
    display: "swap",
})

/**
 * @summary Minecraft Ten font.
 * @description This font is used to display Minecraft Ten text. Mostly headers.
 */
export const MINECRAFT_TEN = localFont({
    src: "../../public/assets/fonts/MinecraftTen.ttf",
    variable: "--font-minecraft-ten-face",
    display: "swap",
})
