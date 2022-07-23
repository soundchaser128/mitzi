import React, {useRef} from "react"
import clsx from "clsx"
import type {Image, Settings} from "~/routes/banner"
import Fraction from "fraction.js"
import ImageCropModal from "./ImageCropModal"
import type {Crop} from "react-image-crop"
import CanvasPreview from "./canvasPreview"

export interface BannerProps {
  files: Image[]
  settings: Settings
  onChangeImageCrop: (id: string, crop: Crop) => void
  modalImage: Image | null
  setModalImage: (image: Image | null) => void
}

function calculateAspectRatioForImage(
  aspectRatio: Fraction,
  numberOfImages: number
): Fraction {
  if (numberOfImages === 0) {
    return aspectRatio
  } else {
    return aspectRatio.div(numberOfImages)
  }
}

const Banner: React.FC<BannerProps> = ({
  files,
  settings,
  onChangeImageCrop,
  modalImage,
  setModalImage,
}) => {
  const bannerFrameRef = useRef<HTMLDivElement | null>(null)
  const imageRatio = calculateAspectRatioForImage(
    new Fraction(settings.aspectRatio),
    files.length
  )

  return (
    <div
      ref={bannerFrameRef}
      id="banner-frame"
      className={clsx(
        "container relative flex h-auto max-w-full grid-flow-row bg-white"
        // [withPadding && "gap-2 p-2"]
      )}
      style={{
        aspectRatio: settings.aspectRatio,
        fontFamily: settings.font ? settings.font.family : undefined,
      }}
    >
      <ImageCropModal
        onSave={onChangeImageCrop}
        isOpen={Boolean(modalImage)}
        closeModal={() => setModalImage(null)}
        imageBlobUrl={modalImage?.url}
        imageId={modalImage?.id}
        title="Edit image"
        aspectRatio={imageRatio.valueOf()}
      />

      {files.length === 0 && (
        <div className="flex h-full w-full items-center justify-center text-xl">
          Upload some images to get started.
        </div>
      )}
      {files.map((image, idx) => (
        // <img
        //   className={clsx(
        //     "object-cover",
        //     settings.darken && "brightness-50",
        //     settings.lowerContrast && "contrast-50"
        //   )}
        //   src={image.url}
        //   key={idx}
        //   alt="user-uploaded data"
        //   style={{
        //     aspectRatio: `${imageRatio.n} / ${imageRatio.d}`,
        //     objectPosition: `${image.crop.x}px ${image.crop.y}px`,
        //   }}
        // />
        <CanvasPreview key={idx} crop={image?.crop} src={image.url} />
      ))}
      {files.length > 0 && (
        <h1
          className="absolute top-0 right-0 z-10 flex h-full w-full items-center justify-center text-8xl font-bold"
          style={{color: settings.fontColor}}
        >
          {settings.text}
        </h1>
      )}
    </div>
  )
}

export default Banner
