import React from "react"

interface CommissionTier {
  name: string
  price: number
  currency: string
  image: string
  info: string[]
}

type TemplateType = "basic"

export type TemplateProps = {
  template: TemplateType
  tiers: CommissionTier[]
}

const BasicTemplateTier: React.FC<{tier: CommissionTier}> = ({tier}) => {
  return (
    <article className="relative">
      <div className="flex flex-col rounded-3xl bg-white pb-8 shadow-lg">
        <img
          src={tier.image}
          alt={tier.name}
          className="h-[400px] rounded-t-3xl object-cover object-top"
        />

        <div className="mt-4 px-10">
          <header className="mb-4 text-center">
            <h1 className="text-4xl font-bold">{tier.name}</h1>
            <p className="text-2xl text-gray-700">
              {tier.currency}
              {tier.price}
            </p>
          </header>

          <ul className="list-disc text-gray-700">
            {tier.info.map((info, idx) => (
              <li key={idx}>{info}</li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  )
}

const BasicTemplate: React.FC<TemplateProps> = ({tiers}) => {
  return (
    <div
      id="preview-frame"
      className="container flex w-auto bg-sky-50 items-center justify-center gap-2 shadow-lg px-12 py-4"
    >
      {tiers.map((tier) => (
        <BasicTemplateTier key={tier.name} tier={tier} />
      ))}
    </div>
  )
}

const templates = {
  basic: BasicTemplate,
}

const Preview: React.FC<TemplateProps> = (props) => {
  const Template = templates[props.template]

  return (
    <div className="justify-center flex min-h-screen w-full items-center bg-gray-700">
      <Template {...props} />
    </div>
  )
}

export default Preview
