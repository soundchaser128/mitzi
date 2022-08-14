import type {FontFamiliy} from "./fonts.server"

export async function loadFont(font: FontFamiliy) {
  const cssUrl = `https://fonts.googleapis.com/css?family=${font.family}`
  const response = await fetch(cssUrl)
  const css = await response.text()
  const style = document.createElement("style")
  style.innerHTML = css
  document.head.appendChild(style)
}
