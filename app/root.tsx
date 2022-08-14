import type {
  HeadersFunction,
  LinksFunction,
  MetaFunction,
} from "@remix-run/node"
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react"

import tailwindStylesheetUrl from "./styles/tailwind.css"
import reactCropStyles from "react-image-crop/dist/ReactCrop.css"

export const links: LinksFunction = () => {
  return [
    {rel: "stylesheet", href: tailwindStylesheetUrl},
    {rel: "stylesheet", href: reactCropStyles},
  ]
}

export let headers: HeadersFunction = () => {
  return {"Cache-Control": "s-max-age=1, stale-while-revalidate=31540000"}
}

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Mitzi",
  viewport: "width=device-width,initial-scale=1",
})

export default function App() {
  return (
    <html lang="en" data-theme="corporate">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
