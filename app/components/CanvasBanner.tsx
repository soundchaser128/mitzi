import Fraction from "fraction.js"
import {useEffect, useMemo, useRef, useState} from "react"
import type {Crop} from "react-image-crop"
import type {Image, Settings} from "~/routes/create/banner"
import ImageCropModal from "./ImageCropModal"
import {useCustomFont} from "~/hooks/useCustomFont"
import createLogger from "~/helpers/log"

const logger = createLogger("CanvasBanner")
export interface BannerProps {
  files: Image[]
  settings: Settings
  onChangeImageCrop: (id: string, crop: Crop) => void
  modalImage: Image | null
  setModalImage: (image: Image | null) => void
}

const loadImage = async (url: string) => {
  const element = document.createElement("img")
  element.src = url
  await new Promise<void>((resolve) => {
    element.addEventListener("load", () => {
      // console.log("image.onload", url)
      resolve()
    })
  })
  return element
}

const useLoadImages = (urls: string[]) => {
  const [images, setImages] = useState<HTMLImageElement[]>()

  useEffect(() => {
    if (!urls || urls.length === 0) {
      return
    }

    Promise.all(urls.map((url) => loadImage(url))).then((results) => {
      setImages(results)
    })

    return () => images?.forEach((e) => e.remove())
  }, [urls])

  return images
}

function renderImages(
  ctx: CanvasRenderingContext2D,
  aspectRatio: string,
  width: number,
  height: number,
  files: Image[],
  imageElements: HTMLImageElement[]
) {
  const imageWidth = Math.floor(width / files.length)
  const imageAspectRatio = new Fraction(aspectRatio).div(
    files.length === 0 ? 1 : files.length
  )

  for (let idx = 0; idx < files.length; idx++) {
    const image = files[idx]
    const xPosition = idx * imageWidth

    const img = imageElements[idx]
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
  }
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
  const urls = useMemo(() => files.map((f) => f.url), [files])

  const {loading, font} = useCustomFont(settings.font)
  logger("font loading=%s, font=%O", loading)

  const images = useLoadImages(urls)
  logger("loaded images %O", images)

  useEffect(() => {
    console.time("render")
    logger("rendering canvas content")
    if (!canvasRef.current || !canvasSize) {
      return
    }

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) {
      return
    }
    const [width, height] = canvasSize

    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, width, height)

    if (!images || images.length === 0) {
      return
    }

    renderImages(ctx, settings.aspectRatio, width, height, files, images)
    logger("rendered all images, rendering text")
    ctx.font = `8rem ${font?.family || "sans-serif"}`
    logger("rendering with font '%s'", ctx.font)

    ctx.textAlign = "center"
    ctx.fillStyle = settings.fontColor
    ctx.fillText(settings.text, width / 2, height / 2)
    if (settings.textOutline) {
      ctx.strokeStyle = "black"
      ctx.lineWidth = 4
      ctx.strokeText(settings.text, width / 2, height / 2)
    }

    logger("rendered text")
    console.timeEnd("render")
  }, [
    canvasSize,
    files,
    font?.family,
    images,
    settings.aspectRatio,
    settings.fontColor,
    settings.text,
    settings.textOutline,
  ])

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
      <canvas
        ref={canvasRef}
        id="banner-frame"
        className="w-full"
        style={{aspectRatio: settings.aspectRatio, fontFamily: font?.family}}
      />
    </>
  )
}

export default CanvasBanner
