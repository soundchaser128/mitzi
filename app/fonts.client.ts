export async function loadFont(family: string, url: string) {
  const fontFace = new FontFace(family, `url(${url})`)
  const font = await fontFace.load()
  document.fonts.add(font)
  return font
}
