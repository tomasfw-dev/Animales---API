# API de Animales

API REST de práctica hecha con **Express** y **TypeScript**. Los datos se guardan en memoria a partir de un JSON (los cambios se pierden al reiniciar el servidor).

## Requisitos

- Node.js y npm

## Instalación y uso

```bash
npm install
npm run dev
```

El servidor corre en `http://localhost:3000`.

Para compilar y ejecutar la versión de producción local:

```bash
npm run tsc
npm start
```

## Endpoints

Base: `/api/animales`

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/` | Lista todos los animales (sin `comentario`) |
| `GET` | `/:id` | Obtiene un animal por ID |
| `POST` | `/` | Crea un animal |

### Crear animal (`POST /`)

Body JSON:

```json
{
  "nombre": "Luna",
  "categoria": "mamífero",
  "edad": 3,
  "color": "negro",
  "comentario": "Opcional en la práctica actual"
}
```

Categorías válidas: `mamífero`, `ave`, `reptil`, `anfibio`, `pez`, `invertebrado`.

Respuestas habituales: `201` creado, `400` datos inválidos o nombre duplicado, `404` animal no encontrado.

## Estructura

```
src/
  routes/        # Definición de rutas
  controllers/   # Respuestas HTTP
  services/      # Lógica y datos
  types.d.ts     # Tipos
  index.ts       # Entrada de la app
```

## Estado del proyecto

Incluye listado, búsqueda por ID y alta. Aún no hay actualización ni borrado. Es un resumen práctico de Express + TypeScript, no una API de producción.
