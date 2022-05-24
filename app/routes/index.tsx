import type {CommissionTier, CommissionSheet} from "~/types"
import * as htmlToImage from "html-to-image"
import Preview from "~/components/Preview"
import {useState} from "react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faAdd, faSave, faTrash} from "@fortawesome/free-solid-svg-icons"
import clsx from "clsx"
import useLocalStorage from "~/useLocalStorage"
import AddNewTierModal from "~/components/AddNewTierModal"
import styles from "~/styles/styles"

const localStorageKey = "savedCommissionData"

const initialState: CommissionSheet = {
  template: "card",
  currency: "dollar",
  fontFamily: "Antic",
  fontUrl:
    "http://themes.googleusercontent.com/static/fonts/antic/v4/hEa8XCNM7tXGzD0Uk0AipA.ttf",
  rules: [
    "No characters under 18 years of age",
    "No beast, guro, or other extreme content",
    "Content is under my discretion, I can reject requests I don't want to accept",
  ],
  tiers: [
    {
      name: "Safe For Work",
      image: "/images/placeholder.jpg",
      info: ["One character", "Simple background"],
      price: 350,
    },
    {
      name: "Solo Female",
      image: "/images/placeholder.jpg",
      info: ["One character", "More elaborate background"],
      price: 450,
    },
    {
      name: "Male x Female",
      image: "/images/placeholder.jpg",
      info: ["Two characters", "More elaborate background"],
      price: 450,
    },
  ],

  links: {
    twitter: {data: "soundchaser128", display: "@soundchaser128"},
    website: {
      data: "https://soundchaser128.xyz",
      display: "soundchaser128.xyz",
    },
    discord: {
      data: "http://discord.gg/VUQXF8Y",
      display: "soundchaser128",
    },
  },
}

// export const loader: LoaderFunction = async () => {
//   const fonts = await fetchFonts()
//   console.log(fonts)
//   return json(fonts)
// }

export default function Index() {
  const [data, setData] = useLocalStorage(localStorageKey, initialState)
  const [modalOpen, setModalOpen] = useState(false)
  const [newRule, setNewRule] = useState("")

  const createScreenshot = async () => {
    const previewElement = document.getElementById("preview-frame")!
    const dataUrl = await htmlToImage.toPng(previewElement)
    const link = document.createElement("a")
    link.download = "commission-sheet.png"
    link.href = dataUrl
    link.click()
    link.remove()
  }

  const onChange = (key: keyof CommissionSheet, value: any) => {
    const newState = {...data, [key]: value}
    setData(newState)
  }

  const onRemoveTier = (tier: CommissionTier) => {
    if (window.confirm("Are you sure you want to remove this tier?")) {
      const newState = {
        ...data,
        tiers: data.tiers.filter((t) => t.name !== tier.name),
      }
      setData(newState)
    }
  }

  const onRemoveRule = (rule: string) => {
    if (window.confirm("Are you sure you want to remove this rule?")) {
      const newState = {...data, rules: data.rules.filter((r) => r !== rule)}
      setData(newState)
    }
  }

  const onNewTierAdded = (tier: CommissionTier) => {
    const newState = {...data, tiers: [...data.tiers, tier]}
    setData(newState)
  }

  return (
    <main className="relative flex min-h-screen bg-white">
      <section className="z-10 flex flex-col bg-indigo-50 p-4 shadow-xl">
        <h1 className="text-center text-3xl font-bold">
          Commission Sheet Generator
        </h1>
        <p className="text-sm">
          by{" "}
          <a
            className="text-blue-500 underline hover:text-blue-400"
            href="https://soundchaser128.xyz"
            tabIndex={-1}
          >
            <code>soundchaser128</code>
          </a>
        </p>

        <AddNewTierModal
          openModal={() => setModalOpen(true)}
          closeModal={() => setModalOpen(false)}
          isOpen={modalOpen}
          data={data}
          handleSubmit={onNewTierAdded}
        />

        <form className="mt-4 flex flex-col gap-8">
          <div className={styles.field}>
            <h2 className="text-xl font-bold">Select currency</h2>
            <div className="flex gap-4">
              <div>
                <input
                  className="mr-2"
                  type="radio"
                  name="currency"
                  value="dollar"
                  checked={data.currency === "dollar"}
                  onChange={(e) => onChange("currency", e.target.value)}
                />
                <label>US Dollar ($)</label>
              </div>
              <div>
                <input
                  className="mr-2"
                  type="radio"
                  name="currency"
                  value="euro"
                  checked={data.currency === "euro"}
                  onChange={(e) => onChange("currency", e.target.value)}
                />
                <label>Euro (€)</label>
              </div>
            </div>
          </div>
          <div className={styles.field}>
            <h2 className="text-xl font-bold">Commission tiers</h2>
            <div className="flex flex-col">
              {data.tiers.map((tier) => (
                <p
                  className="flex justify-between leading-loose"
                  key={tier.name}
                >
                  {tier.name}

                  <button
                    type="button"
                    className="font-sm text-red-500 hover:text-red-600"
                    onClick={() => onRemoveTier(tier)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </p>
              ))}
            </div>

            <button
              type="button"
              className={clsx(
                styles.button.base,
                styles.button.green,
                "self-end"
              )}
              onClick={() => setModalOpen(true)}
            >
              <FontAwesomeIcon icon={faAdd} /> Add tier
            </button>
          </div>

          <div className={styles.field}>
            <h2 className="text-xl font-bold">Rules</h2>
            {data.rules.map((rule) => (
              <p className="flex justify-between" key={rule}>
                <span className="w-80 overflow-hidden overflow-ellipsis whitespace-nowrap leading-loose">
                  {rule}
                </span>

                <button
                  type="button"
                  className="font-sm text-red-500 hover:text-red-600"
                  onClick={() => onRemoveRule(rule)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </p>
            ))}
            <div className="flex gap-2">
              <input
                type="text"
                className="grow text-sm"
                value={newRule}
                onChange={(e) => setNewRule(e.target.value)}
              />
              <button
                type="button"
                className={clsx(styles.button.base, styles.button.green)}
                onClick={() => {
                  setNewRule("")
                  setData({...data, rules: [...data.rules, newRule]})
                }}
              >
                <FontAwesomeIcon icon={faAdd} /> Add rule
              </button>
            </div>
          </div>

          <div className={styles.field}>
            <h2 className="text-xl font-bold">Socials</h2>
            {/* {data.links.map((link, idx) => (
              <p className="flex justify-between leading-loose" key={idx}>
                <SocialLink {...link} />

                <button
                  type="button"
                  className="font-sm text-red-500 hover:text-red-600"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </p>
            ))} */}
            <div className="flex gap-2">
              <input
                type="text"
                className="grow text-sm"
                value={newRule}
                onChange={(e) => setNewRule(e.target.value)}
              />
              <button
                type="button"
                className={clsx(styles.button.base, styles.button.green)}
                onClick={() => {
                  setNewRule("")
                  setData({...data, rules: [...data.rules, newRule]})
                }}
              >
                <FontAwesomeIcon icon={faAdd} /> Add link
              </button>
            </div>
          </div>
        </form>

        <button
          id="download-button"
          onClick={createScreenshot}
          className={clsx(styles.button.base, styles.button.green, "mt-8")}
        >
          <FontAwesomeIcon icon={faSave} /> Save as image
        </button>
      </section>

      <section className="grow bg-white">
        <Preview {...data} />
      </section>
    </main>
  )
}
