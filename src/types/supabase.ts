export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string | null
          status: 'active' | 'inactive' | 'archived'
          owner_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description?: string | null
          status?: 'active' | 'inactive' | 'archived'
          owner_id: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string | null
          status?: 'active' | 'inactive' | 'archived'
          owner_id?: string
        }
      }
      features: {
        Row: {
          id: string
          title: string
          description: string
          status: 'planned' | 'in-progress' | 'completed' | 'blocked'
          priority: 'low' | 'medium' | 'high' | 'urgent'
          start_date: string
          end_date: string
          progress: number
          dependencies: string[]
          assignees: string[]
          created_at: string
          updated_at: string
          owner_id: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          status?: 'planned' | 'in-progress' | 'completed' | 'blocked'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          start_date: string
          end_date: string
          progress?: number
          dependencies?: string[]
          assignees?: string[]
          created_at?: string
          updated_at?: string
          owner_id: string
        }
        Update: {
          title?: string
          description?: string
          status?: 'planned' | 'in-progress' | 'completed' | 'blocked'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          start_date?: string
          end_date?: string
          progress?: number
          dependencies?: string[]
          assignees?: string[]
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          name: string | null
          avatar_url: string | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          email: string
          name?: string | null
          avatar_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          name?: string | null
          avatar_url?: string | null
        }
      }
    }
  }
} 