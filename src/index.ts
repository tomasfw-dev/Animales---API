import express from 'express'
import animalesRouter from './routes/animalesRoutes'
const app = express()
app.use(express.json())
const PORT = 3000

app.use('/api/animales', animalesRouter)

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`)
})