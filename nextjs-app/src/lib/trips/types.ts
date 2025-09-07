export type TripStatus = 'draft' | 'published' | 'archived'

export interface TripMetadata {
  geographies?: {
    countries?: string[]
    regions?: string[]
    cities?: string[]
  }
  dates?: {
    start?: string
    end?: string
    season?: string
  }
  durationDays?: number
  constraints?: string
}

export interface TripRecord {
  id: string
  slug: string
  title: string
  description: string | null
  status: TripStatus
  published: boolean
  created_at: string
  updated_at: string
  created_by: string
  metadata: TripMetadata | null
}

export interface CreateTripInput {
  title?: string
  description?: string
  interests?: string[]
  metadata?: TripMetadata
}

export interface UpdateTripInput {
  id: string
  title?: string
  description?: string | null
  status?: TripStatus
  published?: boolean
  interests?: string[]
  metadata?: TripMetadata | null
}


