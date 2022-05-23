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
  links?: SocialLink[]
  currency: "dollar" | "euro"
}

export type SocialLink =
  | {
      type: "twitter"
      user: string
    }
  | {
      type: "instagram"
      user: string
    }
  | {
      type: "website"
      url: string
    }
  | {
      type: "discord"
      user: string
    }
