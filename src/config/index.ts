/*======= External Dependencies and Modules =======*/
import 'dotenv/config'

export const dev = {
  app: {
    port: process.env.PORT || 3003,
  },
  db: {
    url: process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/ecommerce-db',
  },
}
