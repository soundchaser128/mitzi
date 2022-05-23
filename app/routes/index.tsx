import type {CommissionTier, TemplateProps} from "./preview"
import * as htmlToImage from "html-to-image"
import Preview from "./preview"
import React, {useState} from "react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faAdd, faTrash} from "@fortawesome/free-solid-svg-icons"
import clsx from "clsx"
import {Dialog, Transition} from "@headlessui/react"

const styles = {
  label: "font-semibold",
  input: "grow text-sm",
  button: {
    base: "rounded-lg py-2 px-4 text-center font-bold text-white",
    green: "bg-green-500 hover:bg-green-600",
    red: "bg-red-500 hover:bg-red-600 text-sm",
  },
}

const initialState: TemplateProps = {
  template: "basic",
  currency: "dollar",
  rules: [
    "No characters under 18 years of age",
    "No beast, guro, or other extreme content",
    "Content is under my discretion, I can reject requests I don't want to accept",
  ],
  tiers: [
    {
      name: "Safe For Work",
      image: "https://i.redd.it/bgzblcxgci091.jpg",
      info: ["One character", "Simple background"],
      price: 350,
    },
    {
      name: "Solo Female",
      image: "https://i.redd.it/bgzblcxgci091.jpg",
      info: ["One character", "More elaborate background"],
      price: 450,
    },
    {
      name: "Male x Female",
      image: "https://i.redd.it/bgzblcxgci091.jpg",
      info: ["Two characters", "More elaborate background"],
      price: 450,
    },
  ],

  links: [
    {type: "twitter", user: "soundchaser128"},
    {type: "website", url: "soundchaser128.xyz"},
    {type: "discord", user: "soundchaser128#4495"},
  ],
}

const ModalForm: React.FC<{
  data: TemplateProps
  isOpen: boolean
  openModal: () => void
  closeModal: () => void
}> = ({data, isOpen, openModal, closeModal}) => {
  const [newTier, setNewTier] = useState<CommissionTier>({
    name: "",
    image: "",
    info: [],
    price: 0,
  })

  const onSubmit: React.FormEventHandler = (e) => {
    e.preventDefault()
    console.log(newTier)

    closeModal()
  }

  const onChange = (key: keyof CommissionTier, value: any) => {
    setNewTier({...newTier, [key]: value})
  }

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Add a new tier
                </Dialog.Title>
                <div className="mt-2"></div>

                <div className="mt-4">
                  <form className="flex flex-col gap-4" onSubmit={onSubmit}>
                    <div className="flex flex-col">
                      <label className="mb-1 block font-medium text-gray-700">
                        Tier name
                      </label>
                      <input
                        className="text-sm"
                        type="text"
                        placeholder="Name"
                        value={newTier?.name}
                        onChange={(e) => onChange("name", e.target.value)}
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="mb-1 block font-medium text-gray-700">
                        Price
                      </label>
                      <input
                        className="text-sm"
                        type="number"
                        placeholder="Price"
                        value={newTier?.price || ""}
                        onChange={(e) => onChange("price", e.target.value)}
                      />
                    </div>

                    {/* TODO image upload */}

                    <button
                      className={clsx(
                        styles.button.base,
                        styles.button.green,
                        "self-end"
                      )}
                    >
                      <FontAwesomeIcon icon={faAdd} /> Add
                    </button>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default function Index() {
  const [data, setData] = useState(initialState)
  const [modalOpen, setModalOpen] = useState(false)

  const createScreenshot = async () => {
    const previewElement = document.getElementById("preview-frame")!
    const dataUrl = await htmlToImage.toPng(previewElement)
    const link = document.createElement("a")
    link.download = "commission-sheet.png"
    link.href = dataUrl
    link.click()
    link.remove()
  }

  const onChange = (key: keyof TemplateProps, value: any) => {
    setData({...data, [key]: value})
  }

  const onRemoveTier = (tier: CommissionTier) => {
    if (window.confirm("Are you sure you want to remove this tier?")) {
      setData({...data, tiers: data.tiers.filter((t) => t.name !== tier.name)})
    }
  }

  const onRemoveRule = (rule: string) => {
    if (window.confirm("Are you sure you want to remove this rule?")) {
      setData({...data, rules: data.rules.filter((r) => r !== rule)})
    }
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

        <ModalForm
          openModal={() => setModalOpen(true)}
          closeModal={() => setModalOpen(false)}
          isOpen={modalOpen}
          data={data}
        />

        <form className="-mx-4 mt-4 flex grow flex-col gap-4 px-4 pt-2">
          <div className="flex flex-col">
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
          <div className="flex flex-col">
            <h2 className="text-xl font-bold">Commission tiers</h2>
            <div className="flex flex-col">
              {data.tiers.map((tier) => (
                <p className="flex justify-between" key={tier.name}>
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

          <div>
            <h2 className="text-xl font-bold">Rules</h2>
            <div className="flex flex-col">
              {(data.rules || []).map((rule) => (
                <p className="flex justify-between " key={rule}>
                  <span className="w-80 overflow-hidden overflow-ellipsis whitespace-nowrap">
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
            </div>
          </div>
        </form>

        <button
          id="download-button"
          onClick={createScreenshot}
          className={clsx(styles.button.base, styles.button.green)}
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
