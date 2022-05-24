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
  fontFamily?: string
  fontUrl?: string
}

export interface SocialLink {
  data: string
  display: string
}
