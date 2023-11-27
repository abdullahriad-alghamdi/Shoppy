/*======= External Dependencies and Modules =======*/
import express, { Application } from 'express'
import morgan from 'morgan'

/*======= Internal Modules or Files =======*/
// Configuration
import { dev } from './config'
import { connectDB } from './config/db'

// Middlewares
import { errorHandler } from './middlewares/errorHandler'
import myLogger from './middlewares/logger'

// Routes
import productRoutes from './routes/productRoutes'
import categoryRoutes from './routes/categoryRoutes'
import orderRoutes from './routes/orderRoutes'
import userRoutes from './routes/userRoutes'
import authRoutes from './routes/authRoutes'

const app: Application = express()
const port: string | number = dev.app.port

app.listen(port, () => {
  console.log(`Server listening on port http://localhost:${port}`)
  connectDB()
})

// Use middlewares
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(myLogger)

// Use routes
app.use('/products', productRoutes)
app.use('/categories', categoryRoutes)
app.use('/users', userRoutes)
app.use('/orders', orderRoutes)
app.use('/auth', authRoutes)

// Default route
app.get('/', (req, res) => {
  res.send(
    'Welcome to our E-commerce API to use this API please refer to the documentation in our github repository'
  )
})

// Error handling
app.use((req, res, next) => {
  try {
    const error = new Error('Not found')
    res.status(404)
    next(error)
  } catch (error) {
    next(error)
  }
})

app.use(errorHandler)
