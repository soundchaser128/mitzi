import {faSpinner} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import clsx from "clsx"
import Fraction from "fraction.js"
import {useEffect, useRef, useState} from "react"
import type {BannerProps} from "./Banner"
import ImageCropModal from "./ImageCropModal"

async function handleImageLoad(
  img: HTMLImageElement,
  func: () => void
): Promise<void> {
  return new Promise((resolve) => {
    img.onload = () => {
      func()
      resolve()
    }
  })
}

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
  const [rendering, setRendering] = useState(false)

  useEffect(() => {
    if (!canvasRef.current) {
      return
    }

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) {
      return
    }

    setRendering(true)

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

    const promises = files.map(async (image, idx) => {
      const xPosition = idx * imageWidth

      const img = document.createElement("img")
      img.src = image.url

      return handleImageLoad(img, () => {
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

        img.remove()
      })
    })

    Promise.all(promises)
      .then()
      .catch(console.error)
      .finally(() => setRendering(false))
  }, [files, settings.aspectRatio])

  return (
    <>
      <ImageCropModal
        onSave={onChangeImageCrop}
        isOpen={Boolean(modalImage)}
        closeModal={() => setModalImage(null)}
        imageBlobUrl={modalImage?.url}
        imageId={modalImage?.id}
        initialCrop={modalImage?.crop}
        title="Edit image"
        aspectRatio={imageAspectRatio.valueOf()}
      />
      {rendering && (
        <div
          className="flex w-full items-center justify-center bg-white"
          style={{aspectRatio: settings.aspectRatio}}
        >
          <FontAwesomeIcon
            icon={faSpinner}
            className="h-16 w-16 animate-spin"
          />
        </div>
      )}
      <canvas
        ref={canvasRef}
        id="banner-frame"
        className={clsx("w-full", rendering && "hidden")}
        style={{aspectRatio: settings.aspectRatio}}
      />
    </>
  )
}

export default CanvasBanner
