import {useEffect, useMemo, useRef} from "react"
import type {BannerProps} from "./Banner"

const CanvasBanner: React.FC<BannerProps> = ({
  files,
  settings,
  onChangeImageCrop,
  modalImage,
  setModalImage,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) {
      return
    }

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) {
      return
    }

    const width = canvasRef.current?.clientWidth
    const height = canvasRef.current?.clientHeight
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, width, height)

    const imageWidth = Math.floor(width / files.length)
    const imageHeight = height

    files.forEach((image, idx) => {
      const xPosition = idx * imageWidth

      const img = document.createElement("img")
      img.src = image.url

      img.onload = (e) => {
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, width, height)

        // ctx.drawImage(
        //   img,
        //   image.crop?.x || 0,
        //   image.crop?.y || 0,
        //   image.crop?.width || img.width,
        //   image.crop?.height || img.height,
        //   xPosition,
        //   0,
        //   imageWidth,
        //   imageHeight
        // )
      }

      // document.removeChild(img)
    })
  }, [canvasRef, files])

  return (
    <canvas
      ref={canvasRef}
      id="banner-frame"
      className="w-full"
      style={{aspectRatio: "3 / 1"}}
    />
  )
}

export default CanvasBanner
