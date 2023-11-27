/*======= External Dependencies and Modules =======*/
import { NextFunction, Request, Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'

/*======= Internal Modules or Files =======*/
// Models
import User from '../models/userSchema'
// Utils
import { createHTTPError } from '../utils/createError'
// Configurations
import { dev } from '../config'
// Types
import { CustomRequest } from '../types/userTypes'

// isLoggedIn -> it checks if user is logged in
export const isLoggedIn = (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.cookies.access_token
    if (!accessToken) {
      throw createHTTPError(401, 'You are not logged in! please log in to get access')
    }
    const decode = jwt.verify(accessToken, dev.app.jwtUserAccessKey) as JwtPayload
    if (!decode) {
      throw createHTTPError(401, 'Invalid token or token expired')
    }
    req.user_id = decode._id
    next()
  } catch (err) {
    next(err)
  }
}

// isLoggedOut -> it checks if user is logged out
export const isLoggedOut = (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.cookies.access_token
    if (!accessToken) {
      throw createHTTPError(401, "You don't have access, please log in to get access")
    }

    next()
  } catch (err) {
    next(err)
  }
}

// isAdmin -> it checks if user is admin
export const isAdmin = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user_id)

    if (user?.isAdmin) {
      next()
    } else {
      throw createHTTPError(401, 'Sorry, only admin can do this')
    }
  } catch (err) {
    next(err)
  }
}
