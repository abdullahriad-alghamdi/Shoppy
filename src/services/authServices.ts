/*======= External Dependencies and Modules =======*/
import bcrypt from 'bcrypt'

/*======= Internal Modules or Files =======*/
// Models
import User from '../models/userSchema'
// Utils
import { createHTTPError } from '../utils/createError'

export const login = async (email: string, password: string) => {
  const usersExist = await User.findOne({ email: email })

  if (!usersExist) {
    throw createHTTPError(404, 'User does not exist')
  }
  console.log('pass: ', password, 'usersExist.password: ', usersExist.password)
  const passwordMatch = await bcrypt.compare(password, usersExist.password)

  if (!passwordMatch) {
    throw createHTTPError(404, 'Password does not match')
  }

  if (usersExist?.isBanned) {
    throw createHTTPError(403, 'Unauthorized access, you are banned please contact admin@gmail.com')
  }
  return usersExist
}
