'use client'

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side anonymous client for public reads with proper cookie handling
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false, // Let the callback route handle this
    flowType: 'pkce'
  }
})


// Types for better type safety
export type Database = {
  public: {
    Tables: {
      trips: {
        Row: {
          id: string
          slug: string
          title: string
          description: string | null
          published: boolean
          created_at: string
          updated_at: string
          created_by: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          description?: string | null
          published?: boolean
          created_at?: string
          updated_at?: string
          created_by: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          description?: string | null
          published?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string
        }
      }
      trip_interests: {
        Row: {
          id: string
          trip_id: string
          interest: string
          created_at: string
        }
        Insert: {
          id?: string
          trip_id: string
          interest: string
          created_at?: string
        }
        Update: {
          id?: string
          trip_id?: string
          interest?: string
          created_at?: string
        }
      }
      days: {
        Row: {
          id: string
          trip_id: string
          day_number: number
          title: string | null
          created_at: string
        }
        Insert: {
          id?: string
          trip_id: string
          day_number: number
          title?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          trip_id?: string
          day_number?: number
          title?: string | null
          created_at?: string
        }
      }
      day_blocks: {
        Row: {
          id: string
          day_id: string
          block_order: number
          title: string | null
          description: string | null
          location: string | null
          start_time: string | null
          end_time: string | null
          created_at: string
        }
        Insert: {
          id?: string
          day_id: string
          block_order: number
          title?: string | null
          description?: string | null
          location?: string | null
          start_time?: string | null
          end_time?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          day_id?: string
          block_order?: number
          title?: string | null
          description?: string | null
          location?: string | null
          start_time?: string | null
          end_time?: string | null
          created_at?: string
        }
      }
      trip_versions: {
        Row: {
          id: string
          trip_id: string
          version_number: number
          name: string | null
          created_at: string
          created_by: string
        }
        Insert: {
          id?: string
          trip_id: string
          version_number: number
          name?: string | null
          created_at?: string
          created_by: string
        }
        Update: {
          id?: string
          trip_id?: string
          version_number?: number
          name?: string | null
          created_at?: string
          created_by?: string
        }
      }
    }
  }
}