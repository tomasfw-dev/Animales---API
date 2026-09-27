export class AnimalAlreadyExistsError extends Error {
  constructor (nombre: string) {
    super(`Ya existe un animal con el nombre "${nombre}"`)
    this.name = 'AnimalAlreadyExistsError'
  }
}
