import Fraction from "fraction.js"
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
    // const imageHeight = height

    const imageAspectRatio = new Fraction(settings.aspectRatio).div(
      files.length === 0 ? 1 : files.length
    )

    files.forEach((image, idx) => {
      const xPosition = idx * imageWidth

      const img = document.createElement("img")
      img.src = image.url

      img.onload = (e) => {
        const sourceX = 0
        const sourceY = 0
        const sourceWidth = imageAspectRatio
        const sourceHeight = img.height

        console.log({sourceWidth, sourceHeight})

        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = "high"

        ctx.drawImage(
          img,
          sourceX,
          sourceY,
          sourceWidth,
          sourceHeight,
          xPosition,
          0,
          imageWidth,
          height
        )
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
