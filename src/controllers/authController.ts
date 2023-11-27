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
    const user = await login(email, password)

    const accessToken = jwt.sign({ _id: user._id }, dev.app.jwtUserAccessKey, {
      expiresIn: '1h',
    })

    res.cookie('access_token', accessToken, {
      maxAge: 15 * 60 * 1000,
      httpOnly: true,
      sameSite: 'none',
    })
    res.status(200).send({ message: 'Welcome back', name })
  } catch (err) {
    next(err)
  }
}

export const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie('access_token')

    res.status(200).send({ message: 'Logged out successfully' })
  } catch (err) {
    next(err)
  }
}
