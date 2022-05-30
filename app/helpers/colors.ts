export const Colors = {
  slate: ["bg-slate-50", "text-slate-500"],
  gray: ["bg-gray-50", "text-slate-500"],
  zinc: ["bg-zinc-50", "text-slate-500"],
  neutral: ["bg-neutral-50", "text-slate-500"],
  stone: ["bg-stone-50", "text-slate-500"],
  red: ["bg-red-50", "text-slate-500"],
  orange: ["bg-orange-50", "text-slate-500"],
  amber: ["bg-amber-50", "text-slate-500"],
  yellow: ["bg-yellow-50", "text-slate-500"],
  lime: ["bg-lime-50", "text-slate-500"],
  green: ["bg-green-50", "text-slate-500"],
  emerald: ["bg-emerald-50", "text-slate-500"],
  teal: ["bg-teal-50", "text-slate-500"],
  cyan: ["bg-cyan-50", "text-slate-500"],
  sky: ["bg-sky-50", "text-slate-500"],
  blue: ["bg-blue-50", "text-slate-500"],
  indigo: ["bg-indigo-50", "text-slate-500"],
  violet: ["bg-violet-50", "text-slate-500"],
  purple: ["bg-purple-50", "text-slate-500"],
  fuchsia: ["bg-fuchsia-50", "text-slate-500"],
  pink: ["bg-pink-50", "text-slate-500"],
  rose: ["bg-rose-50", "text-slate-500"],
  black: ["bg-black-50", "text-slate-500"],
}

export type Color = keyof typeof Colors

export function getBackgroundColor(color: Color) {
  return Colors[color][0]
}

export function getTextColor(color: Color) {
  return Colors[color][1]
}
