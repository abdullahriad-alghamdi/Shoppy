/*======= External Dependencies and Modules =======*/
import express, { Application } from 'express'
import morgan from 'morgan'

/*======= Internal Modules or Files =======*/
// External Configuration
import { dev } from './config'
import { connectDB } from './config/db'

// Middlewares
import { errorHandler } from './middlewares/errorHandler'

// Routes
import categoryRoutes from './routes/categoryRoutes'
import productRoutes from './routes/productRoutes'
import userRoutes from './routes/userRoutes'

const app: Application = express()
const port: string | number = dev.app.port

app.listen(port, () => {
  console.log(`Server listening on port http://localhost:${port}`)
  connectDB()
})

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/products', productRoutes)
app.use('/categories', categoryRoutes)
app.use('/users', userRoutes)

app.get('/', (req, res) => {
  res.send('Welcome to our E-commerce API')
})

app.use((req, res, next) => {
  res.status(404).json({
    message: 'Route not found',
  })
})

app.use(errorHandler)
