const apiKey = process.env.GOOGLE_FONTS_API_KEY
const apiUrl = `https://www.googleapis.com/webfonts/v1/webfonts?key=${apiKey}&sort=popularity`

export interface FontsResponse {
  kind: string
  items: FontFamily[]
}

export interface FontFamily {
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
  if (response.ok) {
    const json = await response.json()
    return json
  } else {
    const text = await response.text()
    throw new Error(
      `Request failed with status code ${response.status}: ${text}`
    )
  }
}
