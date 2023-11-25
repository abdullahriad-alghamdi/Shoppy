/*======= External Dependencies and Modules =======*/
import 'dotenv/config'

export const dev = {
  app: {
    port: Number(process.env.PORT) || 3003,
    defaultImagePath: process.env.DEFAULT_IMAGE_PATH || 'public/images/default.png',
    jwtUserActivationKey: process.env.JWT_USER_ACTIVATION_KEY || 'secret@key',
    smtpUsername: process.env.SMTP_USERNAME || 'gmdbod5@gmail.com',
    smtpPassword: process.env.SMTP_PASSWORD || 'gwxn wfrw yxyi udnl',
  },
  db: {
    url: process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/ecommerce-db',
  },
}
