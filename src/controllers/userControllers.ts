/*======= Node.js Modules =======*/
import fs from 'fs'

/*======= External Dependencies and Modules =======*/
import { NextFunction, Request, Response } from 'express'
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { Error } from 'mongoose'
import slugify from 'slugify'
import multer from 'multer'
// Types
import { CustomRequest } from '../types/userTypes'

/*======= Internal Modules or Files =======*/
// Models
import User from '../models/userSchema'

// Types
import { userUpdateType } from '../types/userTypes'

// Configuration
import { dev } from '../config'

// Utils
import { createHTTPError } from '../utils/createError'

// Helpers
import { handelSendEmail } from '../helper/sendEmail'
import { createJSONWebToken, verifyJSONWebToken } from '../helper/jwtHelper'
// Services
import {
  deleteUser,
  createNewUser,
  findUser,
  getUsers,
  updateUser,
  updateBanStatusById,
  updateUserProfile,
  registeringUser,
  activatingUser,
  resetMyPasswordProcess,
  resetThePassword,
} from '../services/userServices'

/**======================
 **      User controllers
 *========================**/

// Create user and sending email with activation link
export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const imagePath = req.file?.path
    const { emailData, token } = await registeringUser(req.body, imagePath as string)

    // send email
    await handelSendEmail(emailData)

    res.status(200).json({
      message: 'Check your email to verify your account',
      token: token,
    })
  } catch (error) {
    if (error instanceof Error.ValidationError) {
      const errorMessages = Object.values(error.errors).map((error) => error.message)
      res.status(400).json({ errors: errorMessages })
      next(createHTTPError(400, errorMessages.join(', ')))
    } else {
      return next(error)
    }
  }
}

// Activating user and saving to database
export const activateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.body.token
    const user = await activatingUser(token)

    res.status(201).json({
      message: 'user registered successfully',
      payload: user,
    })
  } catch (error) {
    if (error instanceof TokenExpiredError || error instanceof JsonWebTokenError) {
      const errorMessage =
        error instanceof TokenExpiredError ? 'Token has expired' : 'Invalid token'
      next(createHTTPError(401, errorMessage))
    } else {
      return next(error)
    }
  }
}

// Handling forgot password
export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body
    const { emailData, token } = await resetMyPasswordProcess(email)
    // send email
    await handelSendEmail(emailData)
    res.status(200).json({
      message: 'Check your email to reset your password',
      token: token,
    })
  } catch (error) {
    if (error instanceof Error.ValidationError) {
      const errorMessages = Object.values(error.errors).map((error) => error.message)
      res.status(400).json({ errors: errorMessages })
      next(createHTTPError(400, errorMessages.join(', ')))
    } else {
      return next(error)
    }
  }
}

// Handling reset password
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.body
    const { password } = req.body
    await resetThePassword(token, password)
    res.status(201).json({
      message: 'Your password has been reset successfully',
    })
  } catch (error) {
    if (error instanceof TokenExpiredError || error instanceof JsonWebTokenError) {
      const errorMessage =
        error instanceof TokenExpiredError ? 'Token has expired' : 'Invalid token'
      next(createHTTPError(401, errorMessage))
    } else {
      return next(error)
    }
  }
}

// Get: /users/me -> Get user profile
export const getMe = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req
    const user = await User.findById(user_id)
    res.status(200).json({
      message: 'Get user profile successfully',
      payload: user,
    })
  } catch (error) {
    return next(error)
  }
}

// Put: /users/:slug -> Update user profile
export const updateMe = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const { user_id } = req
  const user = await User.findById(user_id)
  const file = req.file
  const img = file?.path
  const data = req.body

  if (img && user?.image) {
    fs.unlinkSync(user.image)
  }
  const userUpdated = await updateUserProfile(user_id, data, img)
  res.status(200).json({
    message: 'Update user profile successfully',
    payload: userUpdated,
  })
}

/**========================
 **      Admin controllers
 *=========================**/

// Get: /users -> Get all users
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.query

    let page = Number(data.page) || undefined
    const limit = Number(data.limit) || undefined
    const search = data.search as string
    const sort = data.sort as string

    const { users, totalPages, currentPage } = await getUsers(page, limit, search, sort)

    res.status(200).json({
      message: 'fetched all users successfully',
      payload: users,
      totalPages,
      currentPage,
    })
  } catch (error) {
    return next(error)
  }
}

// Get: /users/:slug -> Get user by slug
export const getUserBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params

    const user = await findUser(slug)
    res.status(200).json({
      message: 'Fetched a single user by slug successfully',
      payload: user,
    })
  } catch (error) {
    if (error instanceof Error.ValidationError) {
      const errorMessages = Object.values(error.errors).map((error) => error.message)
      return next(createHTTPError(400, errorMessages))
    } else {
      return next(error)
    }
  }
}

// Post: /users -> Create new user
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const file = req.file
    const img = file?.path
    const data = req.body
    const user = await createNewUser(data, img)

    res.status(201).json({
      message: 'User added successfully',
      payload: user,
    })
  } catch (error) {
    if (error instanceof Error.ValidationError) {
      const errorMessages = Object.values(error.errors).map((error) => error.message)
      return next(createHTTPError(400, errorMessages))
    } else {
      return next(error)
    }
  }
}

// Put: /users/:slug -> Update user
export const updateUserBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { body, params } = req
    const { slug } = params
    const img = req.file?.path
    const oldImg = await User.findOne({ slug: slug }).select('image')
    const user = await updateUser(slug, body as userUpdateType, img)

    if (img && oldImg?.image) {
      fs.unlinkSync(oldImg.image)
    }

    res.status(200).json({
      message: 'Update user by slug successfully',
      payload: user,
    })
  } catch (error) {
    if (error instanceof Error.ValidationError) {
      const errorMessages = Object.values(error.errors).map((error) => error.message)
      return next(createHTTPError(400, errorMessages.join(', ')))
    } else {
      return next(error)
    }
  }
}

// Delete : /users/:slug -> delete user by slug
export const deleteUserBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params

    await deleteUser(slug)
    // get all users after delete
    res.status(200).json({
      message: 'User deleted successfully',
    })
  } catch (error) {
    return next(error)
  }
}

// Handling  update user banned status
export const updateUserBannedStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const isBanned = await updateBanStatusById(id)
    if (isBanned) {
      res.json({
        message: 'User is banned successfully',
      })
    } else {
      res.json({
        message: 'User is unbanned successfully',
      })
    }
  } catch (error) {
    return next(error)
  }
}

// Handling update user role
export const updateUserRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    const user = await User.findById(id)
    if (!user) {
      throw new Error('User not found')
    }

    const isAdmin = !user.isAdmin
    await User.findByIdAndUpdate(id, { isAdmin }, { new: true })
    if (isAdmin) {
      res.json({
        message: 'User role updated to an admin successfully',
      })
    } else {
      res.json({
        message: 'User role updated to a user successfully',
      })
    }
  } catch (error) {
    return next(error)
  }
}
