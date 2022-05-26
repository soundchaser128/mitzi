import type {Color} from "./colors"
import type {FontFamiliy} from "./fonts.server"

export interface CommissionTier {
  name: string
  price: number
  image: string
  info: string[]
  id: string
}

export type TemplateType = "card"

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
  font?: FontFamiliy
  colors: {
    background: Color
    text: Color
  }
}
