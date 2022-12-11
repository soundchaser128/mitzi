import {Outlet} from "@remix-run/react"

export default function App() {
  return (
    <main className="flex h-screen items-center justify-center">
      <Outlet />
    </main>
  )
}
