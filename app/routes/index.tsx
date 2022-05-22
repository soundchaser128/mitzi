import type {TemplateProps} from "./preview"
import * as htmlToImage from "html-to-image"
import Preview from "./preview"

export default function Index() {
  const data: TemplateProps = {
    template: "basic",
    tiers: [
      {
        name: "Safe For Work",
        currency: "$",
        image: "https://pbs.twimg.com/media/FRW7flmXEAE2vr_?format=jpg&name=4096x4096",
        info: ["One character", "Simple background"],
        price: 350,
      },
      {
        name: "Solo Female",
        currency: "$",
        image: "https://pbs.twimg.com/media/FR6wAFCXMAItm-q?format=jpg&name=4096x4096",
        info: ["One character", "More elaborate background"],
        price: 450,
      }
    ],
  }

  const createScreenshot = async () => {
    const previewElement = document.getElementById("preview-frame")!
    const dataUrl = await htmlToImage.toPng(previewElement)
    const link = document.createElement("a")
    link.download = "commission-sheet.png"
    link.href = dataUrl
    link.click()
  }

  return (
    <main className="relative flex min-h-screen bg-white">
      <section className="flex flex-col bg-sky-50 p-4">
        <h1 className="text-center text-3xl font-bold">
          Commission Sheet Generator
        </h1>
        <p>
          by{" "}
          <a
            className="text-blue-500 underline hover:text-blue-400"
            href="https://soundchaser128.xyz"
            tabIndex={-1}
          >
            <code>soundchaser128</code>
          </a>
        </p>

        <form className="mt-4">
          <div className="flex flex-col">
            <label>Select currency</label>
          </div>

          <h2 className="text-xl font-bold">Commission tiers</h2>
          <div className="flex flex-row items-baseline gap-2">
            <label className="text-gray-500">Name</label>
            <input className="grow" type="text" placeholder="Name" />
          </div>
        </form>

        <button
          id="download-button"
          onClick={createScreenshot}
          className="mt-auto block rounded-lg bg-green-500 py-2 px-4 text-center font-bold text-white hover:bg-green-600"
        >
          Save as image
        </button>
      </section>

      <section className="grow">
        <Preview {...data} />
      </section>
    </main>
  )
}
