export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      blurts: {
        Row: {
          id: number
          user_id: string
          topic: string
          subtopic: string
          score: number
          blurt_text: string
          matched_points: string[]
          manual_rag: string | null
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          topic: string
          subtopic: string
          score: number
          blurt_text: string
          matched_points: string[]
          manual_rag?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          topic?: string
          subtopic?: string
          score?: number
          blurt_text?: string
          matched_points?: string[]
          manual_rag?: string | null
          created_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Relationships: []
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