import type { NextFunction, Request, Response } from 'express'
import { AnimalAlreadyExistsError } from '../errors/AnimalAlreadyExistsError'

export const notFoundHandler = (_req: Request, res: Response): void => {
  res.status(404).json({ message: 'Ruta no encontrada' })
}

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (error instanceof AnimalAlreadyExistsError) {
    res.status(409).json({ message: error.message })
    return
  }

  console.error('Error inesperado:', error)
  res.status(500).json({ message: 'Error interno del servidor' })
}
