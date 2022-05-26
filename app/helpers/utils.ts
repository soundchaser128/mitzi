import {nanoid} from "nanoid"

export const getNextId = () => {
  return nanoid()
}

export function get(
  object: Record<string, unknown>,
  path: string,
  defaultValue: unknown = undefined
): unknown {
  const parts = path.split(".")
  for (let part of parts) {
    if (!object) return defaultValue
    if (typeof part === "object") {
      // @ts-ignore
      object = object[part]
    }
  }
  return object ?? defaultValue
}

export function formatPrice(price: number, currency: "dollar" | "euro") {
  const numberFormat = new Intl.NumberFormat(
    currency === "dollar" ? "en-US" : "de-DE",
    {
      currency: currency === "dollar" ? "USD" : "EUR",
      style: "currency",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      currencyDisplay: "symbol",
    }
  )
  return numberFormat.format(price)
}
