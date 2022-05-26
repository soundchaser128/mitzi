import {faCheck, faUpload} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import clsx from "clsx"
import {useCallback, useState} from "react"
import {useDropzone} from "react-dropzone"

const styles = {
  wrapper:
    "flex w-full items-center justify-center rounded-xl border bg-white p-8 text-center text-lg text-black shadow-lg",
}
interface Props {
  onUpload: (file: File) => void
}

const FileDrop: React.FC<Props> = ({onUpload, children}) => {
  const [uploaded, setUploaded] = useState(false)
  const onDrop = useCallback(
    (acceptedFiles) => {
      const files = acceptedFiles as FileList

      if (files.length > 0) {
        onUpload(files[0])
        setUploaded(true)
      }
    },
    [onUpload]
  )
  const {getRootProps, getInputProps} = useDropzone({onDrop})

  return (
    <div
      className={clsx(styles.wrapper, uploaded && "opacity-50")}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <FontAwesomeIcon
        icon={uploaded ? faCheck : faUpload}
        className={clsx("h-8 w-8", uploaded && "text-green-500")}
      />
      {children}
    </div>
  )
}

export default FileDrop
