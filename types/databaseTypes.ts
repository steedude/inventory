export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          user_id: string
          parent_id: string | null
          name: string
          note: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          parent_id?: string | null
          name: string
          note?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          parent_id?: string | null
          name?: string
          note?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      item_groups: {
        Row: {
          id: string
          user_id: string
          name: string
          note: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          note?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          note?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      inventory_logs: {
        Row: {
          id: string
          user_id: string
          item_id: string | null
          item_name: string
          type: string
          changed_fields: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          item_id?: string | null
          item_name: string
          type: string
          changed_fields?: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          item_id?: string | null
          item_name?: string
          type?: string
          changed_fields?: Json
          created_at?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          user_id: string
          low_stock_daily_email_enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          low_stock_daily_email_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          low_stock_daily_email_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      items: {
        Row: {
          id: string
          user_id: string
          category_id: string | null
          group_id: string | null
          location_id: string | null
          name: string
          quantity: number
          min_quantity: number
          low_stock_enabled: boolean
          image_url: string | null
          barcode: string | null
          note: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category_id?: string | null
          group_id?: string | null
          location_id?: string | null
          name: string
          quantity?: number
          min_quantity?: number
          low_stock_enabled?: boolean
          image_url?: string | null
          barcode?: string | null
          note?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          category_id?: string | null
          group_id?: string | null
          location_id?: string | null
          name?: string
          quantity?: number
          min_quantity?: number
          low_stock_enabled?: boolean
          image_url?: string | null
          barcode?: string | null
          note?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      locations: {
        Row: {
          id: string
          user_id: string
          name: string
          note: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          note?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          note?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
