import clsx from "clsx"
import React, {useEffect} from "react"
import {getBackgroundColor} from "~/colors"
import {loadFont} from "~/fonts.client"
import type {CommissionTier, CommissionSheet} from "~/types"
import {formatPrice} from "~/utils"
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

const CardTemplate: React.FC<CommissionSheet> = ({
  tiers,
  rules,
  links,
  currency,
  font,
  colors,
  artistName,
}) => {
  useEffect(() => {
    if (font) {
      loadFont(font).catch(console.error)
    }
  }, [font])

  const backgroundColor = getBackgroundColor(colors.background)
  // const fontColor = getTextColor(colors.text)
  const hasSocialLinks = Object.values(links).some(Boolean)

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

      <div className="flex flex-row items-center gap-2">
        {tiers.map((tier) => (
          <CardTemplateTier key={tier.name} tier={tier} currency={currency} />
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

      {hasSocialLinks && (
        <div className="flex gap-4">
          {Object.entries(links).map(([type, link]) => {
            if (!link.trim().length) {
              return null
            }
            return <SocialLink key={type} type={type as LinkType} data={link} />
          })}
        </div>
      )}
    </div>
  )
}

export default CardTemplate
