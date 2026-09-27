import type { NextFunction, Request, Response } from 'express'
import { z } from 'zod'
import * as animalesServices from '../services/animalesServices'
import { animalIdParamSchema, newAnimalSchema } from '../schemas/animalSchema'

export const traerAnimalesController = (
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const animales = animalesServices.traerTodosLosAnimales()
    res.status(200).json(animales)
  } catch (error) {
    next(error)
  }
}

export const buscarAnimalPorIdController = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const resultado = animalIdParamSchema.safeParse(req.params.id)

    if (!resultado.success) {
      res.status(400).json({ message: 'ID no válido' })
      return
    }

    const animal = animalesServices.buscarAnimalPorId(resultado.data)
    if (animal === undefined) {
      res.status(404).json({ message: 'Animal no encontrado' })
      return
    }

    res.status(200).json(animal)
  } catch (error) {
    next(error)
  }
}

export const agregarAnimalController = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const resultado = newAnimalSchema.safeParse(req.body)

    if (!resultado.success) {
      const { fieldErrors, formErrors } = z.flattenError(resultado.error)
      res.status(400).json({
        message: 'Datos inválidos',
        errors: {
          fieldErrors,
          formErrors
        }
      })
      return
    }

    const animal = animalesServices.agregarAnimal(resultado.data)
    res.status(201).json(animal)
  } catch (error) {
    next(error)
  }
}
