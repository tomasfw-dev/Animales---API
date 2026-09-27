import type { z } from 'zod'
import { animalSchema, newAnimalSchema } from './schemas/animalSchema'

export type NewAnimalEntry = z.infer<typeof newAnimalSchema>
export type AnimalEntry = z.infer<typeof animalSchema>
export type PublicAnimalEntry = Omit<AnimalEntry, 'comentario'>
