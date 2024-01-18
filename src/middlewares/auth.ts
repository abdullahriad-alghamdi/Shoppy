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

// userId -> give the id of the user to the next middleware
export const userId = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.cookies.access_token

    if (accessToken) {
      const decode = jwt.verify(accessToken, dev.app.jwtKey) as JwtPayload
      if (!decode) {
        throw createHTTPError(401, 'Invalid token or token expired')
      }
      req.user_id = decode._id
    }
    return next()
  } catch (error) {
    return next(error)
  }
}

// isLoggedIn -> it checks if user is logged in
export const isLoggedIn = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.cookies.access_token

    if (!accessToken) {
      throw createHTTPError(401, 'You are not logged in! please log in to get access')
    }

    const decode = jwt.verify(accessToken, dev.app.jwtKey) as JwtPayload
    if (!decode) {
      throw createHTTPError(401, 'Invalid token or token expired')
    }
    req.user_id = decode._id

    return next()
  } catch (error) {
    return next(error)
  }
}

// isLoggedOut -> it checks if user is logged out
export const isLoggedOut = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.cookies.access_token
    // to get user id by find user by email
    const currentUser = await User.findById(req.user_id)
    const currentUserEmail = currentUser?.email
    const { email, password } = req.body

    if (currentUserEmail && currentUserEmail !== email) {
      throw createHTTPError(401, `Someone else is logged in, log out first`)
    }
    if (accessToken) {
      throw createHTTPError(401, `You are already logged in`)
    }

    return next()
  } catch (error) {
    return next(error)
  }
}

// isAdmin -> it checks if user is admin
export const isAdmin = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user_id)

    if (user?.isAdmin) {
      return next()
    } else {
      throw createHTTPError(401, 'Sorry, only admin can do this')
    }
  } catch (error) {
    return next(error)
  }
}
