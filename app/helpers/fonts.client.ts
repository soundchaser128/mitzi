import type {FontFamily} from "./fonts.server"

export async function loadFont(font: FontFamily) {
  const cssUrl = `https://fonts.googleapis.com/css?family=${font.family}`
  const response = await fetch(cssUrl)
  const css = await response.text()
  const style = document.createElement("style")
  style.innerHTML = css
  document.head.appendChild(style)
}
