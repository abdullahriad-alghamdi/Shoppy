import jwt from 'jsonwebtoken'

export const createJSONWebToken = (tokenPayload: object, secretKey: string, expiresIn = '') => {
  try {
    if (!tokenPayload) {
        throw new Error('tokenPayload must be a non-empty object')
      }
    if (typeof secretKey === 'string' || secretKey === '') {
      throw new Error('secretKey must be provided string')
    }
    const token = jwt.sign(tokenPayload, secretKey, {
      expiresIn: expiresIn,
    })
    return token
  } catch (error) {
    console.log(error)
    throw new Error('tokenPayload must be a non-empty object')
  }
}

export const verifyJSONWebToken = (token = {}, secretKey = '') => {}
