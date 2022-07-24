import {useEffect, useState} from "react"
import {loadFont} from "./fonts.client"
import type {FontFamiliy} from "./fonts.server"
import createLogger from "./log"

const logger = createLogger("useCustomFont")

export const useCustomFont = (
  font?: FontFamiliy,
  mode?: "css" | "font-face"
) => {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (font) {
      logger("loading font %s", font.family)
      setLoading(true)
      loadFont(font, mode)
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [font, mode])

  return {loading, font}
}
