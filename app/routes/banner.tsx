import {useState} from "react"
import FileDrop from "~/components/FileDrop"
import styles from "../styles/styles"
import Fraction from "fraction.js"
import clsx from "clsx"
import {nanoid} from "nanoid"
import produce from "immer"
import useRenderContent from "~/hooks/useRenderContent"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {
  faAngleDown,
  faAngleUp,
  faSave,
  faSpinner,
  faTrash,
} from "@fortawesome/free-solid-svg-icons"
import {useLoaderData} from "@remix-run/react"
import type {FontFamiliy} from "~/helpers/fonts.server"
import {fetchFonts} from "~/helpers/fonts.server"
import type {LoaderFunction} from "@remix-run/server-runtime"
import {json} from "@remix-run/server-runtime"
import {useCustomFont} from "~/helpers/hooks"
import Dropdown from "~/components/Dropdown"

const aspectRatios = [
  {
    text: "Twitter (3:1)",
    value: "3/1",
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

function clamp(n: number, min: number, max: number) {
  if (n > max) {
    return max
  } else if (n < min) {
    return min
  } else {
    return n
  }
}

interface Image {
  url: string
  position: {x: number; y: number}
  name: string
  id: string
}

interface Settings {
  darken: boolean
  lowerContrast: boolean
  text: string
  font?: FontFamiliy
  fontColor: string
  aspectRatio: string
}

const defaultSettings: Settings = {
  darken: true,
  lowerContrast: false,
  text: "Your Name",
  fontColor: "#ffffff",
  aspectRatio: aspectRatios[0].value,
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

const BannerGenerator: React.FC = () => {
  const fonts = useLoaderData<FontFamiliy[]>()
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
  const loading = useCustomFont(settings.font)

  const onUpload = (uploads: File[]) => {
    const images = uploads.map((file) => ({
      url: URL.createObjectURL(file),
      position: {x: 50, y: 50},
      name: file.name,
      id: nanoid(),
    }))
    setFiles(files.concat(images))
  }

  const onFilePositionChange = (
    index: number,
    axis: "x" | "y",
    value: number
  ) => {
    const newFiles = produce(files, (draft) => {
      draft[index].position[axis] = value
    })
    setFiles(newFiles)
  }

  const onChange = (key: keyof Settings, value: any) => {
    setSettings({...settings, [key]: value})
  }

  const onRemoveImage = (image: Image) => {
    setFiles((files) => files.filter((f) => f.id !== image.id))
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

  const imageRatio = calculateAspectRatioForImage(
    new Fraction(settings.aspectRatio),
    files.length
  ).simplify()
  const aspectRatio = `${imageRatio.n} / ${imageRatio.d}`

  return (
    <main className="relative flex min-h-screen bg-white">
      <section className="flex max-h-screen min-w-fit flex-col overflow-y-auto bg-violet-100 p-2 shadow-xl">
        <button
          id="download-button"
          onClick={createScreenshot}
          className={clsx(styles.button.base, styles.button.green, "mx-2 mt-4")}
          disabled={rendering}
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
              <FontAwesomeIcon icon={faSave} /> Save As Image
            </>
          )}
        </button>
        <form className="mt-4 flex flex-col gap-4 px-2">
          <div className="flex flex-col">
            <label className={styles.label}>Choose format</label>
            <Dropdown
              placeholder="Choose banner format"
              values={aspectRatios}
              onChange={(value) => onChange("aspectRatio", value.value)}
            />
          </div>

          <div className="flex flex-col">
            <label className={styles.label}>Your name</label>
            <input
              placeholder="Enter your name"
              type="text"
              className={styles.input}
              value={settings.text}
              onChange={(e) => onChange("text", e.target.value)}
            />
          </div>
          <div className="flex flex-row justify-between">
            <label htmlFor="darken-image" className={styles.label}>
              Darken images?
            </label>
            <input
              id="darken-image"
              type="checkbox"
              checked={settings.darken}
              onChange={(e) => onChange("darken", e.target.checked)}
              className="h-6 w-6 self-end"
            />
          </div>
          <div className="flex flex-row justify-between">
            <label htmlFor="lower-contrast" className={styles.label}>
              Lower contrast?
            </label>
            <input
              id="lower-contrast"
              type="checkbox"
              checked={settings.lowerContrast}
              onChange={(e) => onChange("lowerContrast", e.target.checked)}
              className="h-6 w-6 self-end"
            />
          </div>

          <div className="flex flex-col">
            <label className={styles.label}>Select font</label>
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
            <label className={styles.label}>Select font color</label>

            <input
              type="color"
              value={settings.fontColor}
              onChange={(e) => onChange("fontColor", e.target.value)}
              title="Font color picker"
              className="h-12 w-36 cursor-pointer self-end"
            />
          </div>

          <div className="flex flex-col">
            <label className={styles.label}>Upload images</label>
            <FileDrop allowMultiple onUpload={onUpload} />
          </div>
        </form>
        {files.length > 0 && (
          <div className="mt-4">
            <div className="flex flex-col gap-4 ">
              {files.map((file, idx) => (
                <div key={file.id}>
                  <p>
                    File <strong>{file.name}</strong>
                  </p>
                  <div className="flex flex-col">
                    <label>Position left/right</label>
                    <input
                      min="0"
                      max="100"
                      title="Adjust image X position"
                      type="range"
                      value={file.position.x}
                      onChange={(event) =>
                        onFilePositionChange(
                          idx,
                          "x",
                          event.target.valueAsNumber
                        )
                      }
                    />
                  </div>
                  <div className="flex flex-col">
                    <label>Position up/down</label>
                    <input
                      min="0"
                      max="100"
                      title="Adjist image Y position"
                      type="range"
                      value={file.position.y}
                      onChange={(event) =>
                        onFilePositionChange(
                          idx,
                          "y",
                          event.target.valueAsNumber
                        )
                      }
                    />
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <button
                        className="p-1 hover:text-gray-800"
                        type="button"
                        title="Shift up"
                        onClick={() => onShiftImage(idx, "up")}
                      >
                        <FontAwesomeIcon icon={faAngleUp} />
                      </button>

                      <button
                        className="p-1 hover:text-gray-800"
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
      <section className="grow bg-neutral-500">
        <div className="flex min-h-screen w-full items-center justify-center">
          <div
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
            {files.length === 0 && (
              <div className="flex h-full w-full items-center justify-center text-xl">
                Upload some images to get started.
              </div>
            )}
            {files.map((image, idx) => (
              <img
                className={clsx(
                  "object-cover",
                  settings.darken && "brightness-50",
                  settings.lowerContrast && "contrast-50"
                )}
                src={image.url}
                key={idx}
                alt="user-uploaded data"
                style={{
                  aspectRatio,
                  objectPosition: `${image.position.x}% ${image.position.y}%`,
                }}
              />
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
        </div>
      </section>
    </main>
  )
}

export default BannerGenerator
