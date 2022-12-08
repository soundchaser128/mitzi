import type {Color} from "./colors"
import type {FontFamily} from "./fonts.server"

export interface CommissionTier {
  name: string
  price: number
  image: string | null
  info: string[]
  id: string
}

export type TemplateType = "card" | "no-border"

export type CommissionSheet = {
  template: TemplateType
  artistName: string
  tiers: CommissionTier[]
  rules: string[]
  links: {
    twitter?: string
    discord?: string
    instagram?: string
    website?: string
  }
  currency: "dollar" | "euro"
  font?: FontFamily
  colors: {
    background: Color
    text: Color
  }
}
