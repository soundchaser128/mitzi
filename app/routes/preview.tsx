import {
  faDiscord,
  faInstagram,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons"
import {faGlobe} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import React from "react"
import type {CommissionTier, TemplateProps} from "~/types"

function formatPrice(price: number, currency: "dollar" | "euro") {
  const numberFormat = new Intl.NumberFormat(
    currency === "dollar" ? "en-US" : "de-DE",
    {
      currency: currency === "dollar" ? "USD" : "EUR",
      style: "currency",
      maximumFractionDigits: 0,
      currencyDisplay: "symbol",
    }
  )
  return numberFormat.format(price)
}

const BasicTemplateTier: React.FC<{
  tier: CommissionTier
  currency: "dollar" | "euro"
}> = ({tier, currency}) => {
  return (
    <article className="relative">
      <div className="flex flex-col rounded-3xl bg-white pb-8 shadow-lg">
        <img
          src={tier.image}
          alt={tier.name}
          className="h-[400px] w-[350px] rounded-t-3xl object-cover object-center"
        />

        <div className="mt-4 px-10">
          <header className="mb-4 text-center">
            <h1 className="text-4xl font-bold">{tier.name}</h1>
            <p className="text-2xl text-gray-700">
              {formatPrice(tier.price, currency)}
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

const BasicTemplate: React.FC<TemplateProps> = ({
  tiers,
  rules,
  links,
  currency,
}) => {
  return (
    <div
      id="preview-frame"
      className="container flex w-auto flex-col items-center justify-center gap-8 bg-sky-50 py-8 px-12 shadow-lg"
    >
      <div className="flex flex-row items-center gap-2">
        {tiers.map((tier) => (
          <BasicTemplateTier key={tier.name} tier={tier} currency={currency} />
        ))}
      </div>
      <div>
        <h2 className="text-xl font-semibold">Rules</h2>
        {rules && rules.length > 0 && (
          <ul className="list-inside list-disc font-light text-gray-600">
            {rules.map((rule, idx) => (
              <li key={idx}>{rule}</li>
            ))}
          </ul>
        )}
      </div>

      {links && (
        <div className="flex gap-4">
          {links.map((link) => {
            switch (link.type) {
              case "twitter":
                return (
                  <a
                    key={link.user}
                    href={`https://twitter.com/${link.user}`}
                    className="font-light text-blue-500 hover:text-blue-400"
                  >
                    <FontAwesomeIcon icon={faTwitter} /> {link.user}
                  </a>
                )
              case "instagram":
                return (
                  <a
                    key={link.user}
                    href={`https://instagram.com/${link.user}`}
                    className="font-light text-blue-500 hover:text-blue-400"
                  >
                    <FontAwesomeIcon icon={faInstagram} /> {link.user}
                  </a>
                )
              case "website":
                return (
                  <a
                    key={link.url}
                    href={link.url}
                    className="font-light text-blue-500 hover:text-blue-400"
                  >
                    <FontAwesomeIcon icon={faGlobe} /> {link.url}
                  </a>
                )
              case "discord":
                return (
                  <a
                    key={link.user}
                    href={`https://discord.gg/${link.user}`}
                    className="font-light text-blue-500 hover:text-blue-400"
                  >
                    <FontAwesomeIcon icon={faDiscord} /> {link.user}
                  </a>
                )
              default:
                return null
            }
          })}
        </div>
      )}
    </div>
  )
}

const templates = {
  basic: BasicTemplate,
}

const Preview: React.FC<TemplateProps> = (props) => {
  const Template = templates[props.template]

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white">
      <Template {...props} />
    </div>
  )
}

export default Preview
