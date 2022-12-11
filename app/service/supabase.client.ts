import {createClient} from "@supabase/supabase-js"
import type {Database} from "./database.types"

declare global {
  interface Window {
    env: {
      PUBLIC_SUPABASE_URL: string
      PUBLIC_SUPABASE_ANON_KEY: string
    }
  }
}

if (!window.env.PUBLIC_SUPABASE_URL)
  throw new Error("PUBLIC_SUPABASE_URL is required")

if (!window.env.PUBLIC_SUPABASE_ANON_KEY)
  throw new Error("PUBLIC_SUPABASE_ANON_KEY is required")

export const supabase = createClient<Database>(
  window.env.PUBLIC_SUPABASE_URL,
  window.env.PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)
