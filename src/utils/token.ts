/*======= External Dependencies and Modules =======*/
import jwt from 'jsonwebtoken'

/*======= Internal Modules or Files =======*/
// Configuration
import { dev } from '../config'
// Types
import { RegistrationTokenPayloadType } from '../types/userTypes'

export const generateToken = (tokenPayload: RegistrationTokenPayloadType) => {
  return jwt.sign(tokenPayload, dev.app.jwtUserActivationKey, {
    expiresIn: '10m',
  })
}

export const verifyToken = (token: string) => {
  return jwt.verify(token, dev.app.jwtUserActivationKey)
}
