// import colors from 'tailwindcss/colors'

export const BackgroundColors = {
  slate: "bg-slate-100",
  gray: "bg-gray-100",
  zinc: "bg-zinc-100",
  stone: "bg-stone-100",
  red: "bg-red-100",
  orange: "bg-orange-100",
  amber: "bg-amber-100",
  yellow: "bg-yellow-100",
  lime: "bg-lime-100",
  green: "bg-green-100",
  emerald: "bg-emerald-100",
  teal: "bg-teal-100",
  cyan: "bg-cyan-100",
  sky: "bg-sky-100",
  blue: "bg-blue-100",
  indigo: "bg-indigo-100",
  violet: "bg-violet-100",
  purple: "bg-purple-100",
  fuchsia: "bg-fuchsia-100",
  pink: "bg-pink-100",
  rose: "bg-rose-100",
}

export type Color = keyof typeof BackgroundColors
export interface TextColors {
  base: string
  light: string
}

export function getBackgroundColor(color: Color) {
  return BackgroundColors[color]
}

export function getTextColors(color: Color): TextColors {
  return {
    base: "text-black",
    light: "text-slate-500",
  }
}
