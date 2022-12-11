import type {
  HeadersFunction,
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node"
import {
  Links,
  LiveReload,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react"

import tailwindStylesheetUrl from "./styles/tailwind.css"
import reactCropStyles from "react-image-crop/dist/ReactCrop.css"
import iconStyles from "@fortawesome/fontawesome-svg-core/styles.css"
import {config} from "@fortawesome/fontawesome-svg-core"
import ThemeToggle from "./components/ThemeToggle"
import {magicLinkStrategy} from "./service/auth.server"
import {User} from "@supabase/supabase-js"

config.autoAddCss = false /* eslint-disable import/first */

export const links: LinksFunction = () => {
  return [
    {rel: "stylesheet", href: tailwindStylesheetUrl},
    {rel: "stylesheet", href: reactCropStyles},
    {rel: "stylesheet", href: iconStyles},
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

type Data = {
  env: Record<string, string>
  user?: User
}

export const loader: LoaderFunction = async ({request}) => {
  const session = await magicLinkStrategy.checkSession(request)
  console.log({session})

  return {
    user: session?.user,
    env: {
      PUBLIC_SUPABASE_URL: process.env.PUBLIC_SUPABASE_URL,
      PUBLIC_SUPABASE_ANON_KEY: process.env.PUBLIC_SUPABASE_ANON_KEY,
    },
  }
}

export default function App() {
  const {env, user} = useLoaderData<Data>()

  return (
    <html lang="en" data-theme="light">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <div className="flex flex-col">
          <nav className="flex justify-between bg-base-200 p-2">
            <span className="font-bold">Mitzi</span>

            <NavLink className="link" to="/auth/login">
              {user ? `Logged in as ${user.email}` : "Log in"}
            </NavLink>
          </nav>

          <Outlet />
        </div>
        <ThemeToggle />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.env = ${JSON.stringify(env)}`,
          }}
        />
      </body>
    </html>
  )
}
