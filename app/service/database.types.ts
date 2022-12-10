export type Json =
  | string
  | number
  | boolean
  | null
  | {[key: string]: Json}
  | Json[]

export interface Database {
  public: {
    Tables: {
      commission_sheet: {
        Row: {
          id: number
          inserted_at: string
          template_type: string
          artist_name: string
          rules: string[]
          currency: string
          background_color: string
          text_color: string
          user_id: string
        }
        Insert: {
          id?: number
          inserted_at?: string
          template_type: string
          artist_name: string
          rules: string[]
          currency: string
          background_color: string
          text_color: string
          user_id: string
        }
        Update: {
          id?: number
          inserted_at?: string
          template_type?: string
          artist_name?: string
          rules?: string[]
          currency?: string
          background_color?: string
          text_color?: string
          user_id?: string
        }
      }
      commission_tier: {
        Row: {
          id: number
          sheet_id: number | null
          name: string
          price: number
          image_url: string
          info_lines: string[]
          user_id: string
        }
        Insert: {
          id?: number
          sheet_id?: number | null
          name: string
          price: number
          image_url: string
          info_lines: string[]
          user_id: string
        }
        Update: {
          id?: number
          sheet_id?: number | null
          name?: string
          price?: number
          image_url?: string
          info_lines?: string[]
          user_id?: string
        }
      }
      social_link: {
        Row: {
          id: number
          sheet_id: number | null
          link_type: string
          url: string
          user_id: string
        }
        Insert: {
          id?: number
          sheet_id?: number | null
          link_type: string
          url: string
          user_id: string
        }
        Update: {
          id?: number
          sheet_id?: number | null
          link_type?: string
          url?: string
          user_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
