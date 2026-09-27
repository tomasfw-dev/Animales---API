# API de Animales

API REST de práctica hecha con **Express** y **TypeScript**. Los datos se guardan en memoria a partir de un JSON (los cambios se pierden al reiniciar el servidor). La validación de entrada se hace con **Zod**.

## Requisitos

- Node.js y npm

## Instalación y uso

```bash
npm install
npm run dev
```

El servidor corre en `http://localhost:3000` (o en el puerto definido por `PORT`).

Para compilar y ejecutar la versión compilada:

```bash
npm run tsc
npm start
```

## Tests

```bash
npm test
npm run test:watch
```

- `npm run tsc` valida y compila solo `src/` hacia `build/`.
- Vitest transpila y ejecuta los tests en `tests/` (no se emiten a `build/`).

## Endpoints

Base: `/api/animales`

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/` | Lista todos los animales (sin `comentario`) |
| `GET` | `/:id` | Obtiene un animal por ID (sin `comentario`) |
| `POST` | `/` | Crea un animal |

### Buscar por ID (`GET /:id`)

El `id` de la ruta debe ser un **entero positivo** dentro del rango seguro de JavaScript.

Respuestas:

- `200` si existe (sin `comentario`)
- `400` si el id es inválido (texto, `0`, negativo, decimal o fuera de rango seguro)
- `404` si el id es válido pero no existe

### Crear animal (`POST /`)

Body JSON:

```json
{
  "nombre": "Luna",
  "categoria": "mamífero",
  "edad": 3,
  "color": "negro",
  "comentario": "Opcional"
}
```

#### Campos y validaciones

| Campo | Reglas |
|-------|--------|
| `nombre` | string obligatorio, sin espacios laterales (trim), máximo 100 caracteres |
| `categoria` | una de: `mamífero`, `ave`, `reptil`, `anfibio`, `pez`, `invertebrado` |
| `edad` | number entero ≥ 0 (no se aceptan strings como `"3"`) |
| `color` | string obligatorio, sin espacios laterales (trim), máximo 100 caracteres |
| `comentario` | string opcional, máximo 1000 caracteres; si no se envía, se guarda como `""` |

No se aceptan propiedades desconocidas en el body.

### Códigos de respuesta

| Código | Cuándo |
|--------|--------|
| `200` | Listado o búsqueda exitosa |
| `201` | Animal creado |
| `400` | Body inválido, ID no válido o JSON malformado |
| `404` | Animal o ruta inexistente |
| `409` | Ya existe un animal con el mismo nombre (sin distinguir mayúsculas) |
| `500` | Error interno (sin exponer detalles al cliente) |

Ejemplo de error de validación (`400`):

```json
{
  "message": "Datos inválidos",
  "errors": {
    "fieldErrors": {
      "edad": ["La edad debe ser un número"]
    },
    "formErrors": []
  }
}
```

Las propiedades desconocidas aparecen en `formErrors`.

JSON malformado (`400`):

```json
{
  "message": "El cuerpo contiene un JSON inválido"
}
```

## Estructura

```
src/
  app.ts         # Configuración de Express (sin listen)
  index.ts       # Arranque del servidor (listen)
  schemas/       # Esquemas Zod
  types.ts       # Tipos derivados con z.infer
  routes/        # Rutas
  controllers/   # HTTP y validación de entrada
  services/      # Lógica y datos en memoria
  errors/        # Errores de dominio
  middleware/    # 404 y errores centralizados
tests/           # Pruebas de integración (Vitest + Supertest)
```

## Estado del proyecto

Incluye listado, búsqueda por ID y alta. Aún no hay actualización ni borrado. Es un resumen práctico de Express + TypeScript, no una API de producción.
