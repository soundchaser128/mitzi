import type {ModalProps} from "./Modal"
import Modal from "./Modal"
import React, {useEffect, useState} from "react"
import type {Crop} from "react-image-crop"
import {centerCrop, makeAspectCrop} from "react-image-crop"
import ReactCrop from "react-image-crop"
import styles from "~/styles/styles"
import clsx from "clsx"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faSave} from "@fortawesome/free-solid-svg-icons"

function scaleCrop(crop: Crop, scaleX: number, scaleY: number): Crop {
  return {
    ...crop,
    x: crop.x * scaleX,
    y: crop.y * scaleY,
    width: crop.width * scaleX,
    height: crop.height * scaleY,
  }
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 100,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  )
}

interface Props extends ModalProps {
  imageBlobUrl?: string
  imageId?: string
  aspectRatio: number
  onSave: (id: string, crop: Crop) => void
  initialCrop?: Crop
}

const ImageCropModal: React.FC<Props> = ({
  imageBlobUrl,
  aspectRatio,
  imageId,
  initialCrop,
  ...props
}) => {
  const [crop, setCrop] = useState<Crop | undefined>()
  const [scale, setScale] = useState<[number, number]>()

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const {width, height, naturalHeight, naturalWidth} = e.currentTarget
    if (!initialCrop) {
      setCrop(centerAspectCrop(width, height, aspectRatio))
    }
    setScale([naturalWidth / width, naturalHeight / height])
  }

  const onSave = () => {
    if (crop && imageId && scale) {
      const [scaleX, scaleY] = scale
      const scaledCrop = scaleCrop(crop, scaleX, scaleY)
      props.onSave(imageId, scaledCrop)
      props.closeModal()
    }
  }

  useEffect(() => {
    if (initialCrop && scale) {
      const [scaleX, scaleY] = scale
      const crop = scaleCrop(initialCrop, 1 / scaleX, 1 / scaleY)
      setCrop(crop)
    }
  }, [initialCrop, scale])

  return (
    <Modal {...props} title="Upload image" size="2xl">
      <div className="flex flex-col">
        <ReactCrop
          className="mt-4"
          crop={crop}
          aspect={aspectRatio}
          onChange={(c) => setCrop(c)}
        >
          <img
            src={imageBlobUrl}
            alt="element to be cropped"
            onLoad={onImageLoad}
          />
        </ReactCrop>

        <button onClick={onSave} className={clsx("btn", "mt-4 self-end")}>
          <FontAwesomeIcon icon={faSave} /> Save
        </button>
      </div>
    </Modal>
  )
}

export default ImageCropModal
