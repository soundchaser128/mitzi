import {useEffect, useState} from "react"
import {loadFont} from "../helpers/fonts.client"
import type {FontFamiliy} from "../helpers/fonts.server"

export const useCustomFont = (font?: FontFamiliy) => {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (font) {
      setLoading(true)
      loadFont(font)
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [font])

  return {loading, font}
}
