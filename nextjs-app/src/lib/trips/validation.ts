import { z } from 'zod'

export const tripStatusEnum = z.enum(['draft', 'published', 'archived'])

export const tripMetadataSchema = z
  .object({
    geographies: z
      .object({
        countries: z.array(z.string().min(1)).default([]),
        regions: z.array(z.string().min(1)).default([]),
        cities: z.array(z.string().min(1)).default([]),
      })
      .partial()
      .default({}),
    dates: z
      .object({
        start: z.string().optional(),
        end: z.string().optional(),
        season: z.string().optional(),
      })
      .partial()
      .default({}),
    durationDays: z.number().int().positive().max(60).optional(),
    constraints: z.string().max(2000).optional(),
  })
  .partial()
  .default({})

export const createTripSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().max(4000).optional(),
  interests: z.array(z.string().min(1)).default([]),
  metadata: tripMetadataSchema.optional(),
})

export const updateTripSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).optional(),
  description: z.string().max(4000).nullable().optional(),
  status: tripStatusEnum.optional(),
  published: z.boolean().optional(),
  interests: z.array(z.string().min(1)).optional(),
  metadata: tripMetadataSchema.nullable().optional(),
})

export type CreateTripSchema = z.infer<typeof createTripSchema>
export type UpdateTripSchema = z.infer<typeof updateTripSchema>


