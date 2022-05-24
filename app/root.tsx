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

export const links: LinksFunction = () => {
  return [{rel: "stylesheet", href: tailwindStylesheetUrl}]
}

export let headers: HeadersFunction = () => {
  return {"Cache-Control": "s-max-age=1, stale-while-revalidate=31540000"}
}

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Commission Sheet Generator",
  viewport: "width=device-width,initial-scale=1",
})

export default function App() {
  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
