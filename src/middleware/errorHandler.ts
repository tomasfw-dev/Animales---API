import type { NextFunction, Request, Response } from 'express'
import { AnimalAlreadyExistsError } from '../errors/AnimalAlreadyExistsError'

const isEntityParseFailedError = (error: unknown): boolean => {
  if (typeof error !== 'object' || error === null) {
    return false
  }

  if (!('status' in error) || !('type' in error)) {
    return false
  }

  const status: unknown = error.status
  const type: unknown = error.type

  return status === 400 && type === 'entity.parse.failed'
}

export const notFoundHandler = (_req: Request, res: Response): void => {
  res.status(404).json({ message: 'Ruta no encontrada' })
}

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (isEntityParseFailedError(error)) {
    res.status(400).json({ message: 'El cuerpo contiene un JSON inválido' })
    return
  }

  if (error instanceof AnimalAlreadyExistsError) {
    res.status(409).json({ message: error.message })
    return
  }

  console.error('Error inesperado:', error)
  res.status(500).json({ message: 'Error interno del servidor' })
}
