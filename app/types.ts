import type {FontFamiliy} from "./fonts.server"

export interface CommissionTier {
  name: string
  price: number
  image: string
  info: string[]
}

export type TemplateType = "card"

export type CommissionSheet = {
  template: TemplateType
  tiers: CommissionTier[]
  rules: string[]
  links: {
    twitter?: SocialLink
    discord?: SocialLink
    instagram?: SocialLink
    website?: SocialLink
  }
  currency: "dollar" | "euro"
  font?: FontFamiliy
}

export interface SocialLink {
  data: string
  display: string
}
