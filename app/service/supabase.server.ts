import {createClient} from "@supabase/supabase-js"
import type {CommissionSheet} from "~/helpers/types"
import type {Database} from "./database.types"

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_KEY!
export const supabase = createClient<Database>(supabaseUrl, supabaseKey)

export async function createCommissionSheet(
  userId: string,
  commissionSheet: CommissionSheet
) {
  const commissionSheetResult = await supabase
    .from("commission_sheet")
    .insert({
      template_type: commissionSheet.template,
      artist_name: commissionSheet.artistName,
      rules: commissionSheet.rules,
      currency: commissionSheet.currency,
      background_color: commissionSheet.colors.background,
      text_color: commissionSheet.colors.text,
      user_id: userId,
    })
    .select("id")
  const sheetId = commissionSheetResult.data![0].id

  await supabase.from("commission_tier").insert(
    commissionSheet.tiers.map((tier) => ({
      name: tier.name,
      sheet_id: sheetId,
      price: tier.price,
      image_url: "todo",
      info_lines: tier.info,
      user_id: userId,
    }))
  )

  await supabase.from("social_link").insert(
    Object.entries(commissionSheet.links).map(([name, url]) => ({
      sheet_id: sheetId,
      link_type: name,
      url: url,
      user_id: userId,
    }))
  )
}

export async function fetchCommissionSheet(artistName: string) {
  return await supabase
    .from("commission_sheet")
    .select("*")
    .eq("artist_name", artistName)
}
