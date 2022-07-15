import {useState} from "react"
import * as htmlToImage from "html-to-image"

const sleep = (ms: number) =>
  new Promise((resolve) => window.setTimeout(resolve, ms))

export interface Settings {
  containerId: string
  fileName: string
  width?: number
  height?: number
}

const useRenderContent = ({containerId, fileName, width, height}: Settings) => {
  const [rendering, setRendering] = useState(false)
  const createScreenshot = async () => {
    setRendering(true)
    try {
      const previewElement = document.getElementById(containerId)!
      const dataUrl = await htmlToImage.toPng(previewElement, {
        pixelRatio: 1,
        width,
        height,
      })
      const link = document.createElement("a")
      link.download = fileName
      link.href = dataUrl
      link.click()
      link.remove()
      await sleep(500)
    } finally {
      setRendering(false)
    }
  }

  return {rendering, createScreenshot}
}

export default useRenderContent
