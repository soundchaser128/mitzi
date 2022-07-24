import {faSpinner} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import clsx from "clsx"
import Fraction from "fraction.js"
import {useEffect, useRef, useState} from "react"
import type {Crop} from "react-image-crop"
import type {Image, Settings} from "~/routes/banner"
import ImageCropModal from "./ImageCropModal"
import debug from "debug"
import useDebouncedEffect from "~/hooks/useDebouncedEffect"

const logger = debug("CanvasBanner")

export interface BannerProps {
  files: Image[]
  settings: Settings
  onChangeImageCrop: (id: string, crop: Crop) => void
  modalImage: Image | null
  setModalImage: (image: Image | null) => void
}

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

function renderImages(
  ctx: CanvasRenderingContext2D,
  aspectRatio: string,
  width: number,
  height: number,
  files: Image[]
): Promise<void>[] {
  const imageWidth = Math.floor(width / files.length)
  const imageAspectRatio = new Fraction(aspectRatio).div(
    files.length === 0 ? 1 : files.length
  )
  return files.map(async (image, idx) => {
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
}

const useSetupCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [canvasSize, setCanvasSize] = useState<[number, number]>()

  useEffect(() => {
    logger("trying to set up canvas")
    if (!canvasRef.current) {
      return
    }
    const width = canvasRef.current.clientWidth
    const height = canvasRef.current.clientHeight
    canvasRef.current.width = width
    canvasRef.current.height = height

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) {
      return
    }

    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = "high"

    setCanvasSize([width, height])
    logger("successfully set up canvas")
  }, [])

  return {canvasRef, canvasSize}
}

const CanvasBanner: React.FC<BannerProps> = ({
  files,
  settings,
  onChangeImageCrop,
  modalImage,
  setModalImage,
}) => {
  const {canvasRef, canvasSize} = useSetupCanvas()
  const imageAspectRatio = new Fraction(settings.aspectRatio).div(
    files.length === 0 ? 1 : files.length
  )
  const [rendering, setRendering] = useState(false)

  // useEffect(() => {}, [])

  useDebouncedEffect(
    () => {
      logger("rendering canvas content")
      if (!canvasRef.current || !canvasSize) {
        return
      }

      const ctx = canvasRef.current.getContext("2d")
      if (!ctx) {
        return
      }

      setRendering(true)
      const [width, height] = canvasSize

      // ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

      ctx.fillStyle = "white"
      ctx.fillRect(0, 0, width, height)

      const inner = async () => {
        await Promise.all(
          renderImages(ctx, settings.aspectRatio, width, height, files)
        )

        logger("rendered all images, rendering text")
        ctx.font = `8rem ${settings.font?.family || "sans-serif"}`
        logger("rendering with font '%s'", ctx.font)

        ctx.textAlign = "center"
        ctx.fillStyle = settings.fontColor
        ctx.fillText(settings.text, width / 2, height / 2)
        logger("rendered text")

        setRendering(false)
      }

      inner().then().catch(console.error)
    },
    500,
    [
      files,
      settings.aspectRatio,
      settings.text,
      settings.fontColor,
      canvasSize,
      settings.font,
    ]
  )

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
