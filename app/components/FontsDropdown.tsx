import React from "react"
import type {FontFamiliy} from "~/helpers/fonts.server"
import {Combobox, Transition} from "@headlessui/react"
import {useState} from "react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faAngleDown, faCheck} from "@fortawesome/free-solid-svg-icons"

interface Props {
  fonts: FontFamiliy[]
  onChange: (font: FontFamiliy) => void
  id?: string
}

const FontsDropdown: React.FC<Props> = ({fonts, onChange, id}) => {
  const [selected, setSelected] = useState<FontFamiliy | null>(null)
  const [query, setQuery] = useState("")

  const filteredFonts =
    query === ""
      ? fonts
      : fonts.filter((person) =>
          person.family
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        )

  const handleChange = (value: FontFamiliy) => {
    setSelected(value)
    onChange(value)
  }

  return (
    <Combobox value={selected} onChange={handleChange}>
      <div id={id} className="relative mt-1">
        <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-sky-300 sm:text-sm">
          <Combobox.Input
            className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-700 focus:ring-0"
            displayValue={(font: FontFamiliy | null) =>
              font?.family || "Select a font"
            }
            onChange={(event) => setQuery(event.target.value)}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <FontAwesomeIcon
              icon={faAngleDown}
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </Combobox.Button>
        </div>
        <Transition
          as={React.Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery("")}
        >
          <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredFonts.length === 0 && query !== "" ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                Nothing found.
              </div>
            ) : (
              filteredFonts.map((person) => (
                <Combobox.Option
                  key={person.family}
                  className={({active}) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? "bg-sky-600 text-white" : "text-gray-900"
                    }`
                  }
                  value={person}
                >
                  {({selected, active}) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {person.family}
                      </span>
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            active ? "text-white" : "text-sky-600"
                          }`}
                        >
                          <FontAwesomeIcon
                            icon={faCheck}
                            className="h-5 w-5"
                            aria-hidden="true"
                          />
                        </span>
                      ) : null}
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  )
}

export default FontsDropdown
