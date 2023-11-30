import jwt from 'jsonwebtoken'

export const createJSONWebToken = (tokenPayload: object, secretKey: string, expiresIn = '') => {
  try {
    const token = jwt.sign(tokenPayload, secretKey, {
      expiresIn: expiresIn,
    })
    return token
  } catch (error) {
    throw new Error('tokenPayload must be a non-empty object')
  }
}

export const verifyJSONWebToken = (token: string, secretKey: string) => {
  try {
    const decoded = jwt.verify(token, secretKey)
    return decoded
  } catch (error) {
    throw new Error('Invalid token')
  }
}
