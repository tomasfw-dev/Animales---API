import { AnimalesEntry,NonSensitiveInfoAnimalesEntry, NewAnimalesEntry} from '../types'
import animalesData from './animales.json'

const animales: Array <AnimalesEntry> = animalesData.animales as Array<AnimalesEntry>
export const getEntries = (): AnimalesEntry[] => animales

export const buscarAnimalPorId = async(id: number): Promise<void | string| NonSensitiveInfoAnimalesEntry | undefined> => {
    const entry = animales.find(animal => animal.id === id)
    if(entry){
        const {comentario, ...restAnimal} = entry
        return restAnimal
    }
    
   return undefined
}

export const traerTodosLosAnimales = async(): Promise<NonSensitiveInfoAnimalesEntry[]> => {
    return animales.map(({id, nombre, categoria, edad, color}) => {
        return {
            id,
            nombre,
            categoria,
            edad,
            color
        }
    })
}

export const agregarAnimal = async (data: NewAnimalesEntry): Promise<string  | undefined | AnimalesEntry> => {
    try {
        if(!data) return 'Debe ingresar los datos del animal'
        const validacionDatos = await validarAnimal(data)
        if(validacionDatos != true) return `${validacionDatos}`
        if(animales.find(animal => animal.nombre === data.nombre)) return `El animal ${data.nombre} ya existe`
        let id = Math.max(0, ...animalesData.animales.map(animal => animal.id)) + 1
        let dataCopia = {...data, id}
        animales.push(dataCopia)
        return dataCopia
    } catch (error) {
        console.error('Error al agregar animal: ', error)
        throw new Error(`${error}`)
    }
}

const validarAnimal = async(data: NewAnimalesEntry): Promise<boolean  | string  | undefined> => {
    try {
        let validaciones : string = ''
        if(!data.nombre || !data.categoria ||( !data.edad && data.edad !== 0)  || !data.color) validaciones += '|| Faltan ingresar datos del animal'
        if(!animalesData.categorias.includes(data.categoria)) validaciones += '|| Debe ingresar una categoria valida'
        if(data.edad && data.edad < 0) validaciones += '|| La edad no puede ser negativa'
        if(data.color && data.color.length > 100) validaciones += '|| El color no puede tener mas de 100 caracteres'
        if(data.comentario && data.comentario.length > 1000) validaciones += '|| El comentario no puede tener mas de 1000 caracteres'
        if(data.nombre && data.nombre.length > 100) validaciones += '|| El nombre no puede tener mas de 100 caracteres'
        if(data.categoria && data.categoria.length > 100) validaciones += '|| La categoria no puede tener mas de 100 caracteres'
        if(validaciones.length > 0) return validaciones
        return true
    } catch (error) {
        console.log('Error al validar animal: ', error)
        throw new Error(`${error}`)
    }
}


