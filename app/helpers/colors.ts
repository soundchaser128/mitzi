export const BackgroundColors = {
  slate: "bg-slate-50",
  gray: "bg-gray-50",
  zinc: "bg-zinc-50",
  stone: "bg-stone-50",
  red: "bg-red-50",
  orange: "bg-orange-50",
  amber: "bg-amber-50",
  yellow: "bg-yellow-50",
  lime: "bg-lime-50",
  green: "bg-green-50",
  emerald: "bg-emerald-50",
  teal: "bg-teal-50",
  cyan: "bg-cyan-50",
  sky: "bg-sky-50",
  blue: "bg-blue-50",
  indigo: "bg-indigo-50",
  violet: "bg-violet-50",
  purple: "bg-purple-50",
  fuchsia: "bg-fuchsia-50",
  pink: "bg-pink-50",
  rose: "bg-rose-50",
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
