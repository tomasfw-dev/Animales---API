type CategoriaAnimal =
  | 'mamífero'
  | 'ave'
  | 'reptil'
  | 'anfibio'
  | 'pez'
  | 'invertebrado'

export interface AnimalesEntry {
    id: number;
    nombre: string;
    categoria: CategoriaAnimal;
    edad: number;
    color: string;
    comentario: string;
}

export type NonSensitiveInfoAnimalesEntry = Omit<AnimalesEntry, 'comentario'>
export type NewAnimalesEntry = Omit<AnimalesEntry, 'id'>