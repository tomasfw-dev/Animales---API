import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Express } from 'express'
import request from 'supertest'

describe('API de animales (integración)', () => {
  let app: Express

  beforeEach(async () => {
    vi.resetModules()
    const appModule = await import('../src/app')
    app = appModule.default
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('GET /api/animales', () => {
    it('responde 200 con un array y sin comentario', async () => {
      const response = await request(app).get('/api/animales')

      expect(response.status).toBe(200)
      expect(Array.isArray(response.body)).toBe(true)
      expect(response.body.length).toBeGreaterThan(0)

      for (const animal of response.body) {
        expect(animal).not.toHaveProperty('comentario')
      }
    })
  })

  describe('GET /api/animales/:id', () => {
    it('responde 200 para un id existente sin comentario', async () => {
      const response = await request(app).get('/api/animales/1')

      expect(response.status).toBe(200)
      expect(response.body).toMatchObject({
        id: 1,
        nombre: 'Luna'
      })
      expect(response.body).not.toHaveProperty('comentario')
    })

    it('responde 404 para un id válido inexistente', async () => {
      const response = await request(app).get('/api/animales/9999')

      expect(response.status).toBe(404)
      expect(response.body).toEqual({ message: 'Animal no encontrado' })
    })

    it('responde 400 para id no numérico', async () => {
      const response = await request(app).get('/api/animales/abc')
      expect(response.status).toBe(400)
      expect(response.body).toEqual({ message: 'ID no válido' })
    })

    it('responde 400 para id 0', async () => {
      const response = await request(app).get('/api/animales/0')
      expect(response.status).toBe(400)
      expect(response.body).toEqual({ message: 'ID no válido' })
    })

    it('responde 400 para id negativo', async () => {
      const response = await request(app).get('/api/animales/-1')
      expect(response.status).toBe(400)
      expect(response.body).toEqual({ message: 'ID no válido' })
    })

    it('responde 400 para id decimal', async () => {
      const response = await request(app).get('/api/animales/1.5')
      expect(response.status).toBe(400)
      expect(response.body).toEqual({ message: 'ID no válido' })
    })

    it('responde 400 para id fuera del rango seguro', async () => {
      const unsafeId = String(Number.MAX_SAFE_INTEGER + 1)
      const response = await request(app).get(`/api/animales/${unsafeId}`)

      expect(response.status).toBe(400)
      expect(response.body).toEqual({ message: 'ID no válido' })
    })
  })

  describe('POST /api/animales', () => {
    it('crea un animal válido con 201', async () => {
      const response = await request(app)
        .post('/api/animales')
        .send({
          nombre: 'Rocky',
          categoria: 'mamífero',
          edad: 4,
          color: 'marrón',
          comentario: 'Muy activo'
        })

      expect(response.status).toBe(201)
      expect(response.body).toMatchObject({
        nombre: 'Rocky',
        categoria: 'mamífero',
        edad: 4,
        color: 'marrón',
        comentario: 'Muy activo'
      })
      expect(typeof response.body.id).toBe('number')
    })

    it('aplica trim a nombre y color', async () => {
      const response = await request(app)
        .post('/api/animales')
        .send({
          nombre: '  RockyTrim  ',
          categoria: 'mamífero',
          edad: 2,
          color: '  marrón  '
        })

      expect(response.status).toBe(201)
      expect(response.body.nombre).toBe('RockyTrim')
      expect(response.body.color).toBe('marrón')
    })

    it('usa comentario vacío cuando se omite', async () => {
      const response = await request(app)
        .post('/api/animales')
        .send({
          nombre: 'SinComentario',
          categoria: 'ave',
          edad: 1,
          color: 'verde'
        })

      expect(response.status).toBe(201)
      expect(response.body.comentario).toBe('')
    })

    it('responde 400 si edad es string', async () => {
      const response = await request(app)
        .post('/api/animales')
        .send({
          nombre: 'EdadString',
          categoria: 'mamífero',
          edad: '3',
          color: 'negro'
        })

      expect(response.status).toBe(400)
      expect(response.body.message).toBe('Datos inválidos')
      expect(response.body.errors.fieldErrors.edad).toBeDefined()
      expect(Array.isArray(response.body.errors.formErrors)).toBe(true)
    })

    it('responde 400 si la categoría es inválida', async () => {
      const response = await request(app)
        .post('/api/animales')
        .send({
          nombre: 'CategoriaInvalida',
          categoria: 'perro',
          edad: 3,
          color: 'negro'
        })

      expect(response.status).toBe(400)
      expect(response.body.errors.fieldErrors.categoria).toBeDefined()
    })

    it('responde 400 si el color está vacío', async () => {
      const response = await request(app)
        .post('/api/animales')
        .send({
          nombre: 'ColorVacio',
          categoria: 'mamífero',
          edad: 3,
          color: ''
        })

      expect(response.status).toBe(400)
      expect(response.body.errors.fieldErrors.color).toBeDefined()
    })

    it('responde 400 si el color es solo espacios', async () => {
      const response = await request(app)
        .post('/api/animales')
        .send({
          nombre: 'ColorEspacios',
          categoria: 'mamífero',
          edad: 3,
          color: '   '
        })

      expect(response.status).toBe(400)
      expect(response.body.errors.fieldErrors.color).toBeDefined()
    })

    it('responde 400 con formErrors si hay propiedades desconocidas', async () => {
      const response = await request(app)
        .post('/api/animales')
        .send({
          nombre: 'ExtraProp',
          categoria: 'mamífero',
          edad: 3,
          color: 'negro',
          extra: true
        })

      expect(response.status).toBe(400)
      expect(response.body.message).toBe('Datos inválidos')
      expect(response.body.errors.formErrors.length).toBeGreaterThan(0)
    })

    it('responde 409 si el nombre ya existe ignorando mayúsculas y espacios', async () => {
      const response = await request(app)
        .post('/api/animales')
        .send({
          nombre: '  luna  ',
          categoria: 'mamífero',
          edad: 2,
          color: 'negro'
        })

      expect(response.status).toBe(409)
      expect(response.body.message).toContain('luna')
    })

    it('responde 400 ante un JSON realmente malformado', async () => {
      const response = await request(app)
        .post('/api/animales')
        .set('Content-Type', 'application/json')
        .send('{nombre:')

      expect(response.status).toBe(400)
      expect(response.body).toEqual({
        message: 'El cuerpo contiene un JSON inválido'
      })
    })
  })

  describe('Otros', () => {
    it('responde 404 para una ruta inexistente', async () => {
      const response = await request(app).get('/api/no-existe')

      expect(response.status).toBe(404)
      expect(response.body).toEqual({ message: 'Ruta no encontrada' })
    })

    it('responde 500 genérico ante un error inesperado sin exponer detalles', async () => {
      vi.resetModules()

      const servicios = await import('../src/services/animalesServices')
      const spy = vi
        .spyOn(servicios, 'traerTodosLosAnimales')
        .mockImplementation(() => {
          throw new Error('secreto-interno')
        })

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const appModule = await import('../src/app')
      const freshApp = appModule.default

      const response = await request(freshApp).get('/api/animales')

      expect(response.status).toBe(500)
      expect(response.body).toEqual({ message: 'Error interno del servidor' })
      expect(JSON.stringify(response.body)).not.toContain('secreto-interno')
      expect(JSON.stringify(response.body)).not.toContain('stack')

      spy.mockRestore()
      consoleSpy.mockRestore()
    })
  })
})
