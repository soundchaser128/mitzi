const apiKey = process.env.GOOGLE_FONTS_API_KEY
const apiUrl = `https://www.googleapis.com/webfonts/v1/webfonts?key=${apiKey}`

export interface FontsResponse {
  kind: string
  items: FontFamiliy[]
}

export interface FontFamiliy {
  kind: string
  family: string
  variants: string[]
  subsets: string[]
  version: string
  lastModified: string
  files: Record<string, string>
}

export async function fetchFonts(): Promise<FontsResponse> {
  const response = await fetch(apiUrl)
  const json = await response.json()
  return json
}
