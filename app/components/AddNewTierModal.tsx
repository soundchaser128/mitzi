import type {CommissionTier, CommissionSheet} from "~/types"
import React, {useState} from "react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faAdd} from "@fortawesome/free-solid-svg-icons"
import clsx from "clsx"
import {Dialog, Transition} from "@headlessui/react"
import FileDrop from "~/components/FileDrop"
import styles from "~/styles/styles"

const AddNewTierModal: React.FC<{
  data: CommissionSheet
  isOpen: boolean
  openModal: () => void
  closeModal: () => void
  handleSubmit: (data: CommissionTier) => void
}> = ({data, isOpen, handleSubmit, closeModal}) => {
  const [newTier, setNewTier] = useState<CommissionTier>({
    name: "",
    image: "",
    info: [],
    price: 0,
  })

  const onSubmit: React.FormEventHandler = (e) => {
    e.preventDefault()
    closeModal()
    handleSubmit(newTier)
  }

  const onChange = (key: keyof CommissionTier, value: any) => {
    setNewTier({...newTier, [key]: value})
  }

  const onUpload = (file: File) => {
    const blobUrl = URL.createObjectURL(file)
    setNewTier({...newTier, image: blobUrl})
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-sky-50 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-xl font-bold leading-6 text-gray-900"
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
                        className={styles.input}
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
                        className={styles.input}
                        type="number"
                        placeholder="Price"
                        value={newTier?.price || ""}
                        onChange={(e) => onChange("price", e.target.value)}
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="mb-1 block font-medium text-gray-700">
                        Upload image
                      </label>
                      <FileDrop onUpload={onUpload} />
                    </div>

                    <div className="flex flex-col">
                      <label className="mb-1 block font-medium text-gray-700">
                        Info
                      </label>
                      <textarea
                        className="text-sm"
                        value={newTier.info.join("\n")}
                        onChange={(e) =>
                          onChange("info", e.target.value.split("\n"))
                        }
                        rows={8}
                      />
                    </div>
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

export default AddNewTierModal
