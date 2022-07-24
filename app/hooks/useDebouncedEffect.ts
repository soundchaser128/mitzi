import type {DependencyList} from "react"
import {useEffect} from "react"

function useDebouncedEffect(
  fn: () => void,
  waitTime: number,
  deps?: DependencyList
) {
  useEffect(() => {
    const t = setTimeout(() => {
      // @ts-ignore
      fn.apply(undefined, deps)
    }, waitTime)

    return () => {
      clearTimeout(t)
    }
  }, deps)
}

export default useDebouncedEffect
