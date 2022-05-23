import {faUpload} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {useCallback} from "react"
import {useDropzone} from "react-dropzone"

interface Props {
  onUpload: (file: File) => void
}

const FileDrop: React.FC<Props> = ({onUpload, children}) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      const files = acceptedFiles as FileList

      if (files.length > 0) {
        onUpload(files[0])
      }
    },
    [onUpload]
  )
  const {getRootProps, getInputProps} = useDropzone({onDrop})

  return (
    <div
      className="flex w-full items-center justify-center rounded-xl border p-8 text-center text-lg text-black shadow-lg"
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <FontAwesomeIcon icon={faUpload} className="h-8 w-8" />
      {children}
    </div>
  )
}

export default FileDrop
