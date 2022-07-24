import type {ModalProps} from "./Modal"
import Modal from "./Modal"
import React, {ImgHTMLAttributes, useState} from "react"
import type {Crop} from "react-image-crop"
import {
  centerCrop,
  makeAspectCrop,
  PercentCrop,
  PixelCrop,
} from "react-image-crop"
import ReactCrop from "react-image-crop"
import type Fraction from "fraction.js"
import styles from "~/styles/styles"
import clsx from "clsx"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faSave} from "@fortawesome/free-solid-svg-icons"

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
}

const ImageCropModal: React.FC<Props> = ({
  imageBlobUrl,
  aspectRatio,
  imageId,
  ...props
}) => {
  const [crop, setCrop] = useState<Crop>()
  const [scale, setScale] = useState<[number, number]>()

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const {width, height, naturalHeight, naturalWidth} = e.currentTarget
    setCrop(centerAspectCrop(width, height, aspectRatio))
    setScale([naturalWidth / width, naturalHeight / height])
  }

  const onSave = () => {
    if (crop && imageId && scale) {
      const [scaleX, scaleY] = scale
      const scaledCrop = {
        ...crop,
        width: crop.width * scaleX,
        height: crop.height * scaleY,
      }
      props.onSave(imageId, scaledCrop)
      props.closeModal()
    }
  }

  return (
    <Modal {...props} title="Upload image" size="2xl">
      <ReactCrop crop={crop} aspect={aspectRatio} onChange={(c) => setCrop(c)}>
        <img
          src={imageBlobUrl}
          alt="element to be cropped"
          onLoad={onImageLoad}
        />
      </ReactCrop>

      <button
        onClick={onSave}
        className={clsx(styles.button.base, styles.button.green)}
      >
        <FontAwesomeIcon icon={faSave} /> Save
      </button>
    </Modal>
  )
}

export default ImageCropModal
