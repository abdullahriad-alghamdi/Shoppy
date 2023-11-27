/*======= External Dependencies and Modules =======*/
import mongoose from 'mongoose'

/*======= Internal Modules or Files =======*/
// Configurations
import { dev } from '.'

export const connectDB = async () => {
  try {
    await mongoose.connect(dev.db.url)
    console.log('Database connected successfully')
  } catch (error) {
    console.error('Database connection failed: ' + error)
    // process.exit(1) // this will exit the application with a failure
  }
}
