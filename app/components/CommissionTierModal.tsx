import type {CommissionTier} from "~/helpers/types"
import React, {useState} from "react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faCheck} from "@fortawesome/free-solid-svg-icons"
import clsx from "clsx"
import {Dialog, Transition} from "@headlessui/react"
import FileDrop from "~/components/FileDrop"
import styles from "~/styles/styles"
import {getNextId} from "~/helpers/utils"
import Modal from "./Modal"

const emptyTier = () => ({
  name: "",
  image: "",
  info: [],
  price: 0,
  id: getNextId(),
})

const CommissionTierModal: React.FC<{
  isOpen: boolean
  openModal: () => void
  closeModal: () => void
  handleSubmit: (data: CommissionTier, type: "edit" | "new") => void
  tierToEdit?: CommissionTier
}> = ({isOpen, handleSubmit, closeModal, tierToEdit}) => {
  const [newTier, setNewTier] = useState<CommissionTier>(
    tierToEdit || emptyTier()
  )

  const onSubmit: React.FormEventHandler = (e) => {
    e.preventDefault()
    closeModal()
    handleSubmit(newTier, tierToEdit ? "edit" : "new")
  }

  const onChange = (key: keyof CommissionTier, value: any) => {
    setNewTier({...newTier, [key]: value})
  }

  const onUpload = (files: File[]) => {
    const blobUrl = URL.createObjectURL(files[0])
    setNewTier({...newTier, image: blobUrl})
  }

  return (
    <Modal isOpen={isOpen} closeModal={closeModal} title="Edit tier">
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
              value={newTier.name}
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
              value={newTier.price || ""}
              onChange={(e) => onChange("price", e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 block font-medium text-gray-700">
              Upload image
            </label>
            <FileDrop doneAfterUpload onUpload={onUpload} />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 block font-medium text-gray-700">Info</label>
            <textarea
              className="text-sm"
              value={newTier.info.join("\n")}
              onChange={(e) => onChange("info", e.target.value.split("\n"))}
              rows={8}
              placeholder="Each line is a separate bullet point."
            />
          </div>
          <button
            className={clsx(
              styles.button.base,
              styles.button.green,
              "self-end"
            )}
          >
            <FontAwesomeIcon icon={faCheck} /> Save
          </button>
        </form>
      </div>
    </Modal>
  )
}

export default CommissionTierModal
