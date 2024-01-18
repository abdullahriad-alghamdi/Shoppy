/*======= External Dependencies and Modules =======*/
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

/*======= Internal Modules or Files =======*/
// Models
import User from '../models/userSchema'
// Configurations
import { dev } from '../config'
// Services
import { login } from '../services/authServices'
// Types
import { CustomRequest } from '../types/userTypes'
// Utils
import { createHTTPError } from '../utils/createError'

/**======================
 **      user controllers
 *========================**/
export const loginUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body
    // check if user exist
    console.log(req.body)
    const user = await login(email, password)

    // create access token
    const accessToken = jwt.sign({ _id: user._id }, dev.app.jwtKey, {
      expiresIn: '30m',
    } as jwt.SignOptions)

    // add access token to cookie
    res.cookie('access_token', accessToken, {
      maxAge: 30 * 60 * 1000,
      httpOnly: true,
      sameSite: 'none',
    })
    // send response
    res.status(200).send({ message: `Welcome ${user.name}! You are now logged in.`, payload: user })
  } catch (error) {
    return next(error)
  }
}

export const logoutUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.user_id
    // get user name
    const user = await User.findById(id)
    // clear cookie
    res.clearCookie('access_token')
    // send response
    res.status(200).send({ message: `You are now logged out. see you soon!` })
  } catch (error) {
    return next(error)
  }
}
