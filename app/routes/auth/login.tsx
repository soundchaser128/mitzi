import type {ActionArgs, LoaderArgs} from "@remix-run/node"
import {Form, useActionData, useTransition} from "@remix-run/react"
import {json, redirect} from "@remix-run/node"
import {
  authenticator,
  magicLinkStrategy,
  sessionStorage,
} from "~/service/auth.server"
import {supabase} from "~/service/supabase.server"
import styles from "~/styles/styles"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faEnvelope} from "@fortawesome/free-solid-svg-icons"
import clsx from "clsx"

export const loader = async ({request}: LoaderArgs) => {
  await magicLinkStrategy.checkSession(request, {
    successRedirect: "/private",
  })

  const session = await sessionStorage.getSession(request.headers.get("Cookie"))

  const error = session.get(authenticator.sessionErrorKey)

  return json({error})
}

export const action = async ({request}: ActionArgs) => {
  const form = await request.clone().formData()
  const email = form?.get("email")

  if (!email) return json({error: {message: "Email is required"}}, 400)
  if (typeof email !== "string")
    return json({error: {message: "Email must be a string"}}, 400)

  const {error} = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.SERVER_URL}/auth/login/callback`,
    },
  })

  if (error) return json({error: {message: error.message}})

  throw redirect("/auth/login/check-your-emails")
}

export default function Screen() {
  const transition = useTransition()
  const actionData = useActionData<typeof action>()

  return (
    <section className="hero max-w-md bg-base-200 text-base-content">
      <div className="hero-content w-full flex-col items-start">
        <h1 className="text-2xl font-bold">Login</h1>
        <p className="">
          Sign up or log in using just your email, you will receive a link in
          your inbox that you can use to log in.
        </p>
        <Form method="post" className="flex w-full flex-col gap-4">
          {actionData?.error && <div>{actionData?.error.message}</div>}
          <div className="flex w-full flex-row items-center gap-2">
            <label className="label font-semibold" htmlFor="email">
              Email
            </label>
            <input
              className="input-primary input grow"
              type="email"
              name="email"
              id="email"
            />
          </div>
          <button
            className={clsx(
              "btn-success btn",
              transition.submission && "btn-disabled"
            )}
          >
            <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
            {transition.submission
              ? "Sending you a magic link"
              : "Send Magic Link"}
          </button>
        </Form>
      </div>
    </section>
  )
}
