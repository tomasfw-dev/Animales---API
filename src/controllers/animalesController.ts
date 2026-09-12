import * as animalesServices from '../services/animalesServices'
import { type Request, type Response } from 'express'

export const traerAnimalesController = async(_req: Request, res: Response): Promise<void> => {
    try {
        const animales = await animalesServices.traerTodosLosAnimales()
        res.status(200).json(animales)
        return
    } catch (error) {
        console.error('Error al obtener animales: ', error)
        res.status(500).json(`Error al obtener animales: ${error}` )
    }
}

export const buscarAnimalPorIdController = async(_req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(_req.params.id)
        if(isNaN(id)) {
            res.status(400).json(`ID no valido`)
            return
        }
        const animales = await animalesServices.buscarAnimalPorId(Number(_req.params.id))
        if(!animales) {
            res.status(404).json(`Animal no encontrado`)
            return
        }
        res.status(200).json(animales)
        return
    } catch (error) {
        console.error('Error al obtener animales: ', error)
        res.status(500).json(`Error al obtener animal ${_req.params.id}: ${error}` )
    }
}

export const agregarAnimalController = async(_req: Request, res: Response): Promise<void> => {
    try {
        const animales = await animalesServices.agregarAnimal(_req.body)
        if(typeof animales === 'string' || animales instanceof String) {
            res.status(400).json(animales)
            return
        }
        res.status(201).json(animales)
        return
    } catch (error) {
        console.error('Error al agregar animal: ', error)
        res.status(500).json(`${error}`)
    }
}