import {useState} from "react"
import FileDrop from "~/components/FileDrop"
import styles from "../styles/styles"
import Fraction from "fraction.js"
import clsx from "clsx"
import {nanoid} from "nanoid"
import produce from "immer"
import useRenderContent from "~/hooks/useRenderContent"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faSave, faSpinner} from "@fortawesome/free-solid-svg-icons"
import FontsDropdown from "~/components/FontsDropdown"
import {useLoaderData} from "@remix-run/react"
import type {FontFamiliy} from "~/helpers/fonts.server"
import {fetchFonts} from "~/helpers/fonts.server"
import type {LoaderFunction} from "@remix-run/server-runtime"
import {json} from "@remix-run/server-runtime"
import {useCustomFont} from "~/helpers/hooks"

const BANNER_ASPECT_RATIO = new Fraction(3, 1)

function calculateAspectRatioForImage(numberOfImages: number): Fraction {
  if (numberOfImages === 0) {
    return BANNER_ASPECT_RATIO
  } else {
    return BANNER_ASPECT_RATIO.div(numberOfImages)
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
  text: string
  font?: FontFamiliy
  fontColor: string
}

const defaultSettings: Settings = {
  darken: true,
  text: "Your Name",
  fontColor: "#ffffff",
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
  const [files, setFiles] = useState<Image[]>([])
  const [settings, setSettings] = useState(defaultSettings)
  const {createScreenshot, rendering} = useRenderContent({
    containerId: "banner-frame",
    fileName: "twitter-banner.png",
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

  const imageRatio = calculateAspectRatioForImage(files.length).simplify()
  const aspectRatio = `${imageRatio.n} / ${imageRatio.d}`

  return (
    <main className="relative flex min-h-screen bg-white">
      <section className="flex max-h-screen min-w-fit flex-col bg-indigo-50 p-2 shadow-xl">
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
        <div className={styles.field}>
          <h2 className="mb-3 text-xl font-bold">Your name</h2>
          <input
            placeholder="Enter your name"
            type="text"
            className={styles.input}
            value={settings.text}
            onChange={(e) => onChange("text", e.target.value)}
          />
        </div>
        <div className={styles.field}>
          <h2 className="mb-3 text-xl font-bold">Darken images?</h2>
          <input
            type="checkbox"
            checked={settings.darken}
            onChange={(e) => onChange("darken", e.target.checked)}
            title="darken the image?"
            className="h-6 w-6"
          />
        </div>
        <div className={styles.field}>
          <h2 className="mb-2 text-xl font-bold">Select font</h2>
          <div>
            <FontsDropdown
              fonts={fonts}
              onChange={(font) => onChange("font", font)}
            />
          </div>
        </div>
        <div className={styles.field}>
          <h2 className="mb-2 text-xl font-bold">Select font color</h2>

          <input
            type="color"
            value={settings.fontColor}
            onChange={(e) => onChange("fontColor", e.target.value)}
            title="Font color picker"
            className="h-12 w-36 cursor-pointer self-end"
          />
        </div>

        <div className={styles.field}>
          <h2 className="mb-3 text-xl font-bold">Upload images</h2>
          <FileDrop allowMultiple onUpload={onUpload} />
        </div>
        {files.length > 0 && (
          <div className={styles.field}>
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
              aspectRatio: "3 / 1",
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
                  settings.darken && "brightness-75"
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
