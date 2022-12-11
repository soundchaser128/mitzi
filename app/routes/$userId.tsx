import {useLoaderData} from "@remix-run/react"
import type {LoaderFunction} from "@remix-run/server-runtime"
import {fetchCommissionSheet} from "~/service/supabase.server"

type LoaderData = ReturnType<typeof fetchCommissionSheet>

export const loader: LoaderFunction = ({params}) => {
  const {userId} = params

  return fetchCommissionSheet(userId!)
}

const CommissionSheet = () => {
  const sheet = useLoaderData<LoaderData>()
  return <pre>{JSON.stringify(sheet, null, 2)}</pre>
}

export default CommissionSheet
