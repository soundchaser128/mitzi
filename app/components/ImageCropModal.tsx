import type {ModalProps} from "./Modal"
import Modal from "./Modal"
import React, {useState} from "react"
import type {Crop} from "react-image-crop"
import {
  centerCrop,
  makeAspectCrop,
  PercentCrop,
  PixelCrop,
} from "react-image-crop"
import ReactCrop from "react-image-crop"

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
}

const ImageCropModal: React.FC<Props> = ({imageBlobUrl, ...props}) => {
  const [crop, setCrop] = useState<Crop>()

  return (
    <Modal {...props} title="Upload image">
      <ReactCrop onChange={(c) => setCrop(c)}>
        <img src={imageBlobUrl} alt="element to be cropped" />
      </ReactCrop>
    </Modal>
  )
}

export default ImageCropModal
