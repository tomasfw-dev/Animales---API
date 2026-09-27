# API de Animales

API REST de práctica hecha con **Express** y **TypeScript**. Los datos se guardan en memoria a partir de un JSON (los cambios se pierden al reiniciar el servidor). La validación de entrada se hace con **Zod**.

## Requisitos

- Node.js y npm

## Instalación y uso

```bash
npm install
npm run dev
```

El servidor corre en `http://localhost:3000`.

Para compilar y ejecutar la versión compilada:

```bash
npm run tsc
npm start
```

## Endpoints

Base: `/api/animales`

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/` | Lista todos los animales (sin `comentario`) |
| `GET` | `/:id` | Obtiene un animal por ID (sin `comentario`) |
| `POST` | `/` | Crea un animal |

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
| `nombre` | string obligatorio, sin espacios laterales, máximo 100 caracteres |
| `categoria` | una de: `mamífero`, `ave`, `reptil`, `anfibio`, `pez`, `invertebrado` |
| `edad` | number entero ≥ 0 (no se aceptan strings como `"3"`) |
| `color` | string obligatorio, máximo 100 caracteres |
| `comentario` | string opcional, máximo 1000 caracteres; si no se envía, se guarda como `""` |

No se aceptan propiedades desconocidas en el body.

### Códigos de respuesta

| Código | Cuándo |
|--------|--------|
| `200` | Listado o búsqueda exitosa |
| `201` | Animal creado |
| `400` | Body inválido o ID no numérico |
| `404` | Animal o ruta inexistente |
| `409` | Ya existe un animal con el mismo nombre (sin distinguir mayúsculas) |
| `500` | Error interno (sin exponer detalles al cliente) |

Ejemplo de error de validación (`400`):

```json
{
  "message": "Datos inválidos",
  "errors": {
    "edad": ["La edad debe ser un número"],
    "categoria": ["La categoría no es válida"]
  }
}
```

## Estructura

```
src/
  schemas/       # Esquemas Zod
  types.ts       # Tipos derivados con z.infer
  routes/        # Rutas
  controllers/   # HTTP y validación de entrada
  services/      # Lógica y datos en memoria
  errors/        # Errores de dominio
  middleware/    # 404 y errores centralizados
  index.ts
```

## Estado del proyecto

Incluye listado, búsqueda por ID y alta. Aún no hay actualización ni borrado. Es un resumen práctico de Express + TypeScript, no una API de producción.
