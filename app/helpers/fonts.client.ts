import type {FontFamiliy} from "./fonts.server"
import createLogger from "./log"

export type FontLoadingMode = "css" | "font-face"

const logger = createLogger("fontsClient")

export async function loadFont(
  font: FontFamiliy,
  mode: FontLoadingMode = "css"
) {
  logger("loading fonts with mode '%s'", mode)
  if (mode === "css") {
    const cssUrl = `https://fonts.googleapis.com/css?family=${font.family}`
    logger("fetching CSS from %s", cssUrl)
    const response = await fetch(cssUrl)
    const css = await response.text()
    const style = document.createElement("style")
    style.innerHTML = css
    document.head.appendChild(style)
    logger("appended style to head element")
  } else if (mode === "font-face") {
    Object.values(font.files).forEach(async (url) => {
      const fontFace = new FontFace(font.family, `url(${url})`)
      await fontFace.load()
      logger("loaded font %s", fontFace.family)
      document.fonts.add(fontFace)
    })

    await document.fonts.ready
    logger("fonts ready")
  }
}
