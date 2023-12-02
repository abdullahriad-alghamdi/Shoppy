/*======= External Dependencies and Modules =======*/
// Configurations
import 'dotenv/config'

export const dev = {
  app: {
    port: Number(process.env.PORT) || 3003,
    defaultImagePath: process.env.DEFAULT_IMAGE_PATH || 'public/images/default.png',
    defaultCategoryId: '656a54ea69e619196c502073',
    jwtUserActivationKey: process.env.JWT_USER_ACTIVATION_KEY || 'secret@key',
    jwtUserAccessKey: process.env.JWT_USER_ACTIVATION_KEY || 'secret@key',
    smtpUsername: process.env.SMTP_USERNAME || 'email@gmail.com',
    smtpPassword: process.env.SMTP_PASSWORD || 'password',
  },
  db: {
    url: process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/sda-ecommerce-db',
  },
}
