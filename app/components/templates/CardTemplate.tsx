import {faSpinner} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import clsx from "clsx"
import React from "react"
import {getBackgroundColor} from "~/helpers/colors"
import type {CommissionTier, CommissionSheet} from "~/helpers/types"
import {formatPrice} from "~/helpers/utils"
import {useCustomFont} from "~/helpers/hooks"
import type {LinkType} from "../SocialLink"
import SocialLink from "../SocialLink"

const CardTemplateTier: React.FC<{
  tier: CommissionTier
  currency: "dollar" | "euro"
}> = ({tier, currency}) => {
  return (
    <article className="relative">
      <div className="flex flex-col rounded-3xl bg-white pb-8 shadow-lg">
        <img
          src={tier.image}
          alt={tier.name}
          className="aspect-square max-h-96 rounded-t-3xl object-cover object-center"
        />

        <div className="mt-4 px-10">
          <header className="mb-4 text-center">
            <h2 className="text-4xl font-bold">{tier.name}</h2>
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

const CardTemplate: React.FC<CommissionSheet> = ({
  tiers,
  rules,
  links,
  currency,
  font,
  colors,
  artistName,
}) => {
  const loading = useCustomFont(font)
  const backgroundColor = getBackgroundColor(colors.background)
  const hasSocialLinks = Object.values(links).some(Boolean)

  if (loading) {
    return (
      <div
        id="preview-frame"
        className={clsx(
          "flex w-auto items-center justify-center",
          backgroundColor
        )}
      >
        <FontAwesomeIcon icon={faSpinner} className="h-12 w-12 animate-spin" />
      </div>
    )
  }

  return (
    <div
      id="preview-frame"
      className={clsx(
        "container flex w-auto flex-col items-center justify-center gap-8 py-8 px-12 shadow-lg",
        backgroundColor
      )}
      style={
        font
          ? {
              fontFamily: font.family,
            }
          : {}
      }
    >
      {artistName && (
        <h1 className="text-4xl font-bold">{artistName}'s Commission Sheet</h1>
      )}

      <div className="flex flex-row items-start gap-2">
        {tiers.map((tier) => (
          <CardTemplateTier key={tier.name} tier={tier} currency={currency} />
        ))}
      </div>
      {rules.length > 0 && (
        <section className="flex w-full justify-center">
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
        </section>
      )}

      {hasSocialLinks && (
        <section className="flex gap-4">
          {Object.entries(links).map(([type, link]) => {
            if (!link.trim().length) {
              return null
            }
            return <SocialLink key={type} type={type as LinkType} data={link} />
          })}
        </section>
      )}
    </div>
  )
}

export default CardTemplate
