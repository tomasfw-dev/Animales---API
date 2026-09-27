import { z } from 'zod'

export const CATEGORIAS_ANIMAL = [
  'mamífero',
  'ave',
  'reptil',
  'anfibio',
  'pez',
  'invertebrado'
] as const

export const newAnimalSchema = z
  .object({
    nombre: z
      .string({ error: 'El nombre debe ser un texto' })
      .trim()
      .min(1, 'El nombre es obligatorio')
      .max(100, 'El nombre no puede superar 100 caracteres'),
    categoria: z.enum(CATEGORIAS_ANIMAL, {
      error: 'La categoría no es válida'
    }),
    edad: z
      .number({ error: 'La edad debe ser un número' })
      .int('La edad debe ser un número entero')
      .nonnegative('La edad no puede ser negativa'),
    color: z
      .string({ error: 'El color debe ser un texto' })
      .min(1, 'El color es obligatorio')
      .max(100, 'El color no puede superar 100 caracteres'),
    comentario: z
      .string({ error: 'El comentario debe ser un texto' })
      .max(1000, 'El comentario no puede superar 1000 caracteres')
      .optional()
      .default('')
  })
  .strict()

export const animalSchema = newAnimalSchema
  .extend({
    id: z
      .number({ error: 'El id debe ser un número' })
      .int('El id debe ser un número entero')
      .positive('El id debe ser un número positivo')
  })
  .strict()

export const animalsArraySchema = z.array(animalSchema)
