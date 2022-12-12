import React, {useState} from "react"
import FileDrop from "~/components/FileDrop"
import styles from "../../styles/styles"

import produce from "immer"
import useRenderContent from "~/hooks/useRenderContent"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {
  faAngleDown,
  faAngleUp,
  faEdit,
  faSave,
  faSpinner,
  faTrash,
} from "@fortawesome/free-solid-svg-icons"
import {useLoaderData} from "@remix-run/react"
import type {FontFamily} from "~/helpers/fonts.server"
import {fetchFonts} from "~/helpers/fonts.server"
import type {LoaderFunction} from "@remix-run/server-runtime"
import {json} from "@remix-run/server-runtime"
import Dropdown from "~/components/Dropdown"
import type {Crop, PixelCrop} from "react-image-crop"
import CanvasBanner from "~/components/CanvasBanner"

const aspectRatios = [
  {
    text: "Twitter (3:1)",
    value: "3/1",
  },
  {
    text: "Patreon (4:1)",
    value: "4/1",
  },
  {
    text: "Pixiv (2:1)",
    value: "2/1",
  },
  {
    text: "Reddit (10:3)",
    value: "10/3",
  },
]

function clamp(n: number, min: number, max: number) {
  if (n > max) {
    return max
  } else if (n < min) {
    return min
  } else {
    return n
  }
}

export interface Image {
  url: string
  crop?: PixelCrop
  name: string
  id: string
}

export interface Settings {
  darken: boolean
  lowerContrast: boolean
  text: string
  font?: FontFamily
  fontColor: string
  aspectRatio: string
  textOutline: boolean
}

const defaultSettings: Settings = {
  darken: true,
  lowerContrast: false,
  text: "Your Name",
  fontColor: "#ffffff",
  aspectRatio: aspectRatios[0].value,
  textOutline: false,
}

export const loader: LoaderFunction = async () => {
  try {
    const fonts = await fetchFonts()
    return json(fonts.items.slice(0, 100))
  } catch (e) {
    console.error(e)
    return json([])
  }
}

export const Label: React.FC<{children: React.ReactNode; htmlFor?: string}> = ({
  children,
  htmlFor,
}) => {
  return (
    <label htmlFor={htmlFor} className="label grow">
      <span className="label-text font-semibold">{children}</span>
    </label>
  )
}

const BannerGenerator: React.FC = () => {
  const fonts = useLoaderData<FontFamily[]>()
  const fontDropdownValues = fonts.map((font) => ({
    text: font.family,
    value: font.family,
  }))
  const [files, setFiles] = useState<Image[]>([])
  const [settings, setSettings] = useState(defaultSettings)
  const bannerName = aspectRatios
    .find((r) => r.value === settings.aspectRatio)
    ?.text?.split(" ")[0]
    ?.toLowerCase()
  const {createScreenshot, rendering} = useRenderContent({
    containerId: "banner-frame",
    fileName: `${bannerName}-banner-${settings.text}.png`,
  })
  const [modalImage, setModalImage] = useState<Image | null>(null)

  const onUpload = (uploads: File[]) => {
    const images: Image[] = uploads.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
      id: Math.random().toString(),
    }))
    setFiles(files.concat(images))
  }

  const onChange = (key: keyof Settings, value: any) => {
    setSettings({...settings, [key]: value})
  }

  const onRemoveImage = (image: Image) => {
    setFiles((files) => files.filter((f) => f.id !== image.id))
  }

  const onChangeImageCrop = (id: string, crop: Crop) => {
    setFiles((files) =>
      produce(files, (draft) => {
        const file = draft.find((f) => f.id === id)
        file!.crop = {
          x: crop.x,
          y: crop.y,
          width: crop.width,
          height: crop.height,
          unit: "px",
        }
      })
    )
  }

  const onShiftImage = (idx: number, direction: "up" | "down") => {
    setFiles(
      produce(files, (draft) => {
        const newIndex = clamp(
          idx + (direction === "up" ? -1 : 1),
          0,
          draft.length - 1
        )
        const tmp = draft[newIndex]
        draft[newIndex] = draft[idx]
        draft[idx] = tmp
      })
    )
  }

  const onEditCrop = (image: Image) => {
    setModalImage(image)
  }

  return (
    <main className="relative flex min-h-screen bg-white">
      <section className="flex max-h-screen min-w-fit flex-col overflow-y-auto bg-base-200 p-2 shadow-xl">
        <button
          id="download-button"
          onClick={createScreenshot}
          className="btn-success btn mx-2 mt-2"
          disabled={rendering || files.length === 0}
          type="button"
        >
          {rendering && (
            <>
              <FontAwesomeIcon icon={faSpinner} className="animate-spin" />{" "}
              Rendering...
            </>
          )}
          {!rendering && (
            <>
              <FontAwesomeIcon icon={faSave} className="mr-2" /> Save As Image
            </>
          )}
        </button>
        <form className="mt-4 flex flex-col gap-4 px-2">
          <div className="flex flex-col">
            <Label>Choose format</Label>
            <Dropdown
              placeholder="Choose banner format"
              values={aspectRatios}
              onChange={(value) => onChange("aspectRatio", value.value)}
            />
          </div>

          <div className="flex flex-col">
            <Label>Your name</Label>
            <input
              placeholder="Enter your name"
              type="text"
              className={styles.input}
              value={settings.text}
              onChange={(e) => onChange("text", e.target.value)}
            />
          </div>
          <div className="flex flex-row justify-between">
            <Label htmlFor="darken-image">Darken images?</Label>
            <input
              id="darken-image"
              type="checkbox"
              checked={settings.darken}
              onChange={(e) => onChange("darken", e.target.checked)}
              className="h-6 w-6 self-center"
            />
          </div>
          <div className="flex flex-row justify-between">
            <Label htmlFor="lower-contrast">Lower contrast?</Label>
            <input
              id="lower-contrast"
              type="checkbox"
              checked={settings.lowerContrast}
              onChange={(e) => onChange("lowerContrast", e.target.checked)}
              className="h-6 w-6 self-center"
            />
          </div>

          <div className="flex flex-col">
            <Label>Select font</Label>
            <Dropdown
              id="fonts-dropdown"
              values={fontDropdownValues}
              onChange={(font) =>
                onChange(
                  "font",
                  fonts.find((f) => f.family === font.value)
                )
              }
              placeholder="Choose a font"
            />
          </div>

          <div className="flex flex-col">
            <Label>Select font color</Label>

            <input
              type="color"
              value={settings.fontColor}
              onChange={(e) => onChange("fontColor", e.target.value)}
              title="Font color picker"
              className="h-12 w-36 cursor-pointer self-end"
            />
          </div>

          <div className="flex flex-col">
            <Label>Upload images</Label>
            <FileDrop button allowMultiple onUpload={onUpload} />
          </div>
        </form>
        {files.length > 0 && (
          <div className="mt-4">
            <div className="flex flex-col gap-4 ">
              {files.map((file, idx) => (
                <div className="flex flex-col" key={file.id}>
                  <div className="flex justify-between">
                    <span>
                      File <strong>{file.name}</strong>
                    </span>
                    <button
                      type="button"
                      className="btn-secondary btn-sm btn"
                      onClick={() => onEditCrop(file)}
                    >
                      <FontAwesomeIcon icon={faEdit} className="mr-1" />
                      <strong>Edit</strong>
                    </button>
                  </div>

                  <div className="flex justify-between">
                    <div className="flex gap-1">
                      <button
                        className="inline-flex items-center justify-center rounded-full border border-black p-1 hover:border-gray-800 hover:text-gray-800"
                        type="button"
                        title="Shift up"
                        onClick={() => onShiftImage(idx, "up")}
                      >
                        <FontAwesomeIcon icon={faAngleUp} />
                      </button>

                      <button
                        className="inline-flex items-center justify-center rounded-full border border-black p-1 hover:border-gray-800 hover:text-gray-800"
                        type="button"
                        title="Shift down"
                        onClick={() => onShiftImage(idx, "down")}
                      >
                        <FontAwesomeIcon icon={faAngleDown} />
                      </button>
                    </div>

                    <button
                      type="button"
                      title="Remove image"
                      className="font-sm p-1 text-rose-500 hover:text-rose-600"
                      onClick={() => onRemoveImage(file)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
      <section className="grow">
        <div className="flex min-h-screen w-full items-center justify-center bg-neutral">
          <CanvasBanner
            files={files}
            settings={settings}
            onChangeImageCrop={onChangeImageCrop}
            modalImage={modalImage}
            setModalImage={setModalImage}
          />
        </div>
      </section>
    </main>
  )
}

export default BannerGenerator