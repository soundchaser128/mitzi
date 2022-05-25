export const Colors = {
  slate: ["bg-slate-50", "text-slate-900"],
  gray: ["bg-gray-50", "text-slate-900"],
  zinc: ["bg-zinc-50", "text-slate-900"],
  neutral: ["bg-neutral-50", "text-slate-900"],
  stone: ["bg-stone-50", "text-slate-900"],
  red: ["bg-red-50", "text-slate-900"],
  orange: ["bg-orange-50", "text-slate-900"],
  amber: ["bg-amber-50", "text-slate-900"],
  yellow: ["bg-yellow-50", "text-slate-900"],
  lime: ["bg-lime-50", "text-slate-900"],
  green: ["bg-green-50", "text-slate-900"],
  emerald: ["bg-emerald-50", "text-slate-900"],
  teal: ["bg-teal-50", "text-slate-900"],
  cyan: ["bg-cyan-50", "text-slate-900"],
  sky: ["bg-sky-50", "text-slate-900"],
  blue: ["bg-blue-50", "text-slate-900"],
  indigo: ["bg-indigo-50", "text-slate-900"],
  violet: ["bg-violet-50", "text-slate-900"],
  purple: ["bg-purple-50", "text-slate-900"],
  fuchsia: ["bg-fuchsia-50", "text-slate-900"],
  pink: ["bg-pink-50", "text-slate-900"],
  rose: ["bg-rose-50", "text-slate-900"],
  black: ["bg-black-50", "text-slate-900"],
}

export type Color = keyof typeof Colors

export function getBackgroundColor(color: Color) {
  return Colors[color][0]
}

export function getTextColor(color: Color) {
  return Colors[color][1]
}
