import animalesData from './animales.json'
import { AnimalAlreadyExistsError } from '../errors/AnimalAlreadyExistsError'
import { animalsArraySchema } from '../schemas/animalSchema'
import type { AnimalEntry, NewAnimalEntry, PublicAnimalEntry } from '../types'

const animales: AnimalEntry[] = animalsArraySchema.parse(animalesData.animales)

const toPublicAnimal = ({ comentario: _comentario, ...animal }: AnimalEntry): PublicAnimalEntry => animal

export const buscarAnimalPorId = (id: number): PublicAnimalEntry | undefined => {
  const entry = animales.find(animal => animal.id === id)
  if (entry === undefined) {
    return undefined
  }
  return toPublicAnimal(entry)
}

export const traerTodosLosAnimales = (): PublicAnimalEntry[] => {
  return animales.map(toPublicAnimal)
}

export const agregarAnimal = (data: NewAnimalEntry): AnimalEntry => {
  const nombreNormalizado = data.nombre.toLowerCase()
  const yaExiste = animales.some(
    animal => animal.nombre.toLowerCase() === nombreNormalizado
  )

  if (yaExiste) {
    throw new AnimalAlreadyExistsError(data.nombre)
  }

  const id = Math.max(0, ...animales.map(animal => animal.id)) + 1
  const nuevoAnimal: AnimalEntry = { ...data, id }
  animales.push(nuevoAnimal)
  return nuevoAnimal
}
