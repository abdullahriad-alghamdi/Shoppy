/*======= External Dependencies and Modules =======*/
// Configurations
import 'dotenv/config'

export const dev = {
  app: {
    port: Number(process.env.PORT) || Number(''),
    defaultImagePath: process.env.DEFAULT_IMAGE_PATH || '',
    jwtUserActivationKey: process.env.JWT_KEY || '',
    jwtUserAccessKey: process.env.JWT_KEY || '',
    smtpUsername: process.env.SMTP_USERNAME || '',
    smtpPassword: process.env.SMTP_PASSWORD || '',
  },
  db: {
    url: process.env.MONGO_URL || '',
  },
  corsOrigin: process.env.CORS_ORIGIN || '',
}
