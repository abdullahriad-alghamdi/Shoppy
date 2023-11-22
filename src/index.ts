import express, { Application } from 'express'
import morgan from 'morgan'

import { dev } from './config'
import { connectDB } from './config/db'
import { errorHandler } from './middlewares/errorHandler'

import productRoutes from './routes/productRoutes'
import categoryRoutes from './routes/CategoryRoutes'

const app: Application = express()
const port: number = dev.app.port

app.listen(port, () => {
  console.log(`Server listening on port http://localhost:${port}`)
  connectDB()
})

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/products', productRoutes)
app.use('/categories', categoryRoutes)

app.get('/', (req, res) => {
  res.send('Welcome to our E-commerce API')
})

app.use((req, res, next) => {
  res.status(404).json({
    message: 'Route not found',
  })
})

app.use(errorHandler)
