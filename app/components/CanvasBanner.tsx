import Fraction from "fraction.js"
import {useEffect, useRef} from "react"
import type {BannerProps} from "./Banner"
import ImageCropModal from "./ImageCropModal"

const CanvasBanner: React.FC<BannerProps> = ({
  files,
  settings,
  onChangeImageCrop,
  modalImage,
  setModalImage,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageAspectRatio = new Fraction(settings.aspectRatio).div(
    files.length === 0 ? 1 : files.length
  )
  useEffect(() => {
    if (!canvasRef.current) {
      return
    }

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) {
      return
    }

    const width = canvasRef.current.clientWidth
    const height = canvasRef.current.clientHeight
    canvasRef.current.width = width
    canvasRef.current.height = height

    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = "high"
    // ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, width, height)

    const imageWidth = Math.floor(width / files.length)

    files.forEach((image, idx) => {
      const xPosition = idx * imageWidth

      const img = document.createElement("img")
      img.src = image.url

      img.onload = (e) => {
        const sourceX = image.crop?.x || 0
        const sourceY = image.crop?.y || 0
        let sourceWidth = img.width
        let sourceHeight = img.height

        if (image.crop) {
          sourceWidth = image.crop.width
          sourceHeight = image.crop.height
        } else {
          if (img.width > img.height) {
            sourceWidth = img.height * imageAspectRatio.valueOf()
          } else {
            sourceHeight = img.width * imageAspectRatio.inverse().valueOf()
          }
        }

        // sourceWidth *= devicePixelRatio
        // sourceHeight *= devicePixelRatio

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
      img.remove()
    })
  }, [canvasRef, files, settings.aspectRatio, imageAspectRatio])

  return (
    <>
      <ImageCropModal
        onSave={onChangeImageCrop}
        isOpen={Boolean(modalImage)}
        closeModal={() => setModalImage(null)}
        imageBlobUrl={modalImage?.url}
        imageId={modalImage?.id}
        title="Edit image"
        aspectRatio={imageAspectRatio.valueOf()}
      />
      <canvas
        ref={canvasRef}
        id="banner-frame"
        className="w-full"
        style={{aspectRatio: settings.aspectRatio}}
      />
    </>
  )
}

export default CanvasBanner
