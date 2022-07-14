import {useState} from "react"
import FileDrop from "~/components/FileDrop"
import styles from "../styles/styles"
import Fraction from "fraction.js"

const BANNER_ASPECT_RATIO = new Fraction(3, 1)

function calculateAspectRatioForImage(numberOfImages: number): Fraction {
  if (numberOfImages === 0) {
    return BANNER_ASPECT_RATIO
  } else {
    return BANNER_ASPECT_RATIO.div(numberOfImages)
  }
}

const Index: React.FC = () => {
  const [files, setFiles] = useState<string[]>([])

  const onUpload = (uploads: File[]) => {
    const urls = uploads.map(URL.createObjectURL)
    setFiles(files.concat(urls))
  }

  const imageRatio = calculateAspectRatioForImage(files.length).simplify()
  const aspectRatio = `${imageRatio.n} / ${imageRatio.d}`

  return (
    <main className="relative flex min-h-screen bg-white">
      <section className="z-10 flex flex-col bg-indigo-50 p-2 shadow-xl">
        <div className={styles.field}>
          <label className={styles.label}>Upload images</label>
          <FileDrop allowMultiple onUpload={onUpload} />
        </div>
      </section>
      <section className="grow bg-white">
        <div className="flex min-h-screen w-full items-center justify-center bg-white">
          <div
            id="banner-frame"
            className="container flex h-auto max-w-full grid-flow-row"
            style={{
              aspectRatio: "3 / 1",
            }}
          >
            {files.map((file, idx) => (
              <img
                className="object-cover"
                src={file}
                key={idx}
                alt="user-uploaded data"
                style={{aspectRatio}}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default Index
