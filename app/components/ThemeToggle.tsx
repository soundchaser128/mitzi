import {faMoon, faSun} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import clsx from "clsx"
import React, {useEffect, useState} from "react"
import useLocalStorage from "~/hooks/useLocalStorage"

interface Props {
  className?: string
}

type Theme = "dark" | "light"

export function getTheme() {
  const element = document.getElementsByTagName("html")[0]
  const theme = element.dataset["theme"] as Theme
  return theme
}

const ThemeToggle: React.FC<Props> = ({className}) => {
  const [theme, setTheme] = useLocalStorage<Theme>("theme")

  useEffect(() => {
    const element = document.getElementsByTagName("html")[0]
    element.dataset["theme"] = theme
  }, [theme])

  const toggleDarkMode = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
  }

  return (
    <button
      id="theme-toggle"
      className={clsx(
        "btn-primary btn fixed bottom-4 right-4 text-xl",
        className
      )}
      onClick={() => toggleDarkMode()}
    >
      <FontAwesomeIcon icon={theme === "dark" ? faSun : faMoon} />
    </button>
  )
}

export default ThemeToggle
