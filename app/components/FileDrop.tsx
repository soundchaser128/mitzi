import {faCheck, faUpload} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import clsx from "clsx"
import {useCallback, useState} from "react"
import {useDropzone} from "react-dropzone"

const styles = {
  wrapper:
    "flex w-full items-center justify-center rounded-xl border bg-white p-8 text-center text-lg text-black cursor-pointer",
}
interface Props {
  onUpload: (files: File[]) => void
  children?: React.ReactNode
  allowMultiple?: boolean
  doneAfterUpload?: boolean
  button?: boolean
}

const FileDrop: React.FC<Props> = ({
  onUpload,
  children,
  allowMultiple,
  doneAfterUpload,
  button,
}) => {
  const [uploaded, setUploaded] = useState(false)
  const onDrop = useCallback(
    (files: File[]) => {
      onUpload(files)

      if (files.length > 0 && doneAfterUpload) {
        setUploaded(true)
      }
    },
    [onUpload, doneAfterUpload]
  )
  const {getRootProps, getInputProps} = useDropzone({
    onDrop,
    maxFiles: allowMultiple ? undefined : 1,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpeg", ".jpg", ".jpe"],
      "image/webp": [".webp"],
      "image/gif": [".gif"],
      "image/svg+xml": [".svg"],
    },
  })

  return (
    <div
      className={
        button
          ? "btn-primary btn-lg btn"
          : clsx(styles.wrapper, uploaded && "opacity-50")
      }
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <FontAwesomeIcon
        icon={uploaded ? faCheck : faUpload}
        className={
          button ? "h-8 w-8" : clsx("h-8 w-8", uploaded && "text-green-500")
        }
      />
      {children}
    </div>
  )
}

export default FileDrop
