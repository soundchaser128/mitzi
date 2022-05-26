import {useState} from "react"

const VERSION =
  typeof process == "undefined"
    ? "local"
    : process.env.VERCEL_GIT_COMMIT_SHA || "local"

interface LocalStorageData<T> {
  version: string
  payload: T
}

function get<T>(key: string): T | null {
  if (typeof window !== "undefined") {
    const item = window.localStorage.getItem(key)
    if (item) {
      const parsed = JSON.parse(item) as LocalStorageData<T>
      if ("version" in parsed && parsed.version === VERSION && parsed.payload) {
        return parsed.payload
      }
    }
  }

  return null
}

function set<T>(key: string, value: T) {
  if (typeof window === "undefined") {
    return
  } else {
    const string = JSON.stringify({
      version: VERSION,
      payload: value,
    })
    window.localStorage.setItem(key, string)
  }
}

export default function useLocalStorage<T>(
  key: string,
  initialValue?: T
): [T, (value: T) => void] {
  // @ts-ignore
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      return get(key) || initialValue
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
      set(key, valueToStore)
    } catch (error) {
      console.error(error)
    }
  }
  return [storedValue, setValue]
}
