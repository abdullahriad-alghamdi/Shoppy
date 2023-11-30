/*======= External Dependencies and Modules =======*/
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

/*======= Internal Modules or Files =======*/
// Configurations
import { dev } from '../config'
// Services
import { login } from '../services/authServices'

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name } = req.body
    // check if user exist
    const user = await login(email, password)
    // create access token
    const accessToken = jwt.sign({ _id: user._id }, dev.app.jwtUserAccessKey, {
      expiresIn: '14m',
    } as jwt.SignOptions)

    // add access token to cookie
    res.cookie('access_token', accessToken, {
      maxAge: 15 * 60 * 1000, // 15 minutes
      httpOnly: true,
      sameSite: 'none',
    })
    // send response
    res.status(200).send({ message: `Welcome ${user.name}!` })
  } catch (err) {
    next(err)
  }
}

export const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // clear cookie
    res.clearCookie('access_token')
    // send response
    res.status(200).send({ message: 'Logout successfully' })
  } catch (err) {
    next(err)
  }
}
