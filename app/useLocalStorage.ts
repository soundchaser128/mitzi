import {useState} from "react"

function get(key: string): string | null {
  if (typeof window === "undefined") {
    return null
  } else {
    return window.localStorage.getItem(key)
  }
}

function set(key: string, value: string) {
  if (typeof window === "undefined") {
    return
  } else {
    window.localStorage.setItem(key, value)
  }
}

export default function useLocalStorage<T>(
  key: string,
  initialValue?: T
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = get(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(error)
      return initialValue
    }
  })
  const setValue = (value: T) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      set(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(error)
    }
  }
  return [storedValue, setValue]
}
