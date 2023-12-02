/*======= External Dependencies and Modules =======*/
import jwt from 'jsonwebtoken'

// Token Generator
export const createJSONWebToken = (tokenPayload: object, secretKey: string, expiresIn = '') => {
  try {
    if (!tokenPayload || Object.keys(tokenPayload).length === 0) {
      throw new Error('tokenPayload must be a non-empty object')
    }
    if (!secretKey) {
      throw new Error('secretKey must be a non-empty string')
    }

    if (!expiresIn) {
      return jwt.sign(tokenPayload, secretKey)
    }
    if (typeof secretKey !== 'string' || secretKey === '') {
      throw new Error('secretKey must be a non-empty string')
    }

    const token = jwt.sign(tokenPayload, secretKey, {
      expiresIn: expiresIn,
    })
    return token
  } catch (error) {
    throw new Error('tokenPayload must be a non-empty object')
  }
}

// Token Verifier
export const verifyJSONWebToken = (token: string, secretKey: string) => {
  try {
    if (!token) {
      throw new Error('token must be a non-empty string')
    }
    if (typeof token !== 'string' || token === '') {
      throw new Error('token must be a non-empty string')
    }
    if (!secretKey) {
      throw new Error('secretKey must be a non-empty string')
    }
    if (typeof secretKey !== 'string' || secretKey === '') {
      throw new Error('secretKey must be a non-empty string')
    }

    const decoded = jwt.verify(token, secretKey)
    return decoded
  } catch (error) {
    throw new Error('Invalid token')
  }
}
