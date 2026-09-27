import express from 'express'
import animalesRouter from './routes/animalesRoutes'
import { errorHandler, notFoundHandler } from './middleware/errorHandler'

const app = express()

app.use(express.json())
app.use('/api/animales', animalesRouter)
app.use(notFoundHandler)
app.use(errorHandler)

export default app
