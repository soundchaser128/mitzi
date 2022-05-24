import type {LinkType} from "./components/SocialLink"

export interface CommissionTier {
  name: string
  price: number
  image: string
  info: string[]
}

export type TemplateType = "basic"

export type CommissionSheet = {
  template: TemplateType
  tiers: CommissionTier[]
  rules: string[]
  links: SocialLink[]
  currency: "dollar" | "euro"
}
export interface SocialLink {
  type: LinkType
  data: string
  display: string
}
