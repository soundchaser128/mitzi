import React from "react"
import {Dialog, Transition} from "@headlessui/react"
import clsx from "clsx"

export interface ModalProps {
  isOpen: boolean
  closeModal: () => void
  title: string
  children?: React.ReactNode
  size?: "md" | "lg" | "xl" | "2xl"
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  closeModal,
  title,
  children,
  size,
}) => {
  let sizeClass
  switch (size) {
    case "md":
      sizeClass = "max-w-md"
      break
    case "lg":
      sizeClass = "max-w-lg"
      break
    case "xl":
      sizeClass = "max-w-xl"
      break
    case "2xl":
      sizeClass = "max-w-2xl"
      break
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
          <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-md" />
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
              <Dialog.Panel
                className={clsx(
                  "w-full max-w-md transform overflow-hidden rounded-2xl bg-sky-50 p-6 text-left align-middle shadow-xl transition-all",
                  sizeClass
                )}
              >
                <Dialog.Title
                  as="h3"
                  className="text-xl font-bold leading-6 text-gray-900"
                >
                  {title}
                </Dialog.Title>

                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default Modal
