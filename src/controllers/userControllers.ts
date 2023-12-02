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
  activatingUser,
} from '../services/userServices'

/**======================
 **      User controllers
 *========================**/

// Create user and sending email with activation link
export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, name, email, password, address, phone } = req.body
    const imagePath = req.file?.path

    const isUserExists = await User.exists({ email: email })

    if (isUserExists) {
      throw createHTTPError(409, 'User already exists')
    }

    const hashedPassword = password && (await bcrypt.hash(password, 10))

    const tokenPayload = {
      username,
      name: name,
      email: email,
      password: hashedPassword,
      address: address,
      phone: phone,
      image: imagePath,
      slug:
        username && typeof username === 'string'
          ? slugify(username, { lower: true })
          : slugify(name, { lower: true }),
    }

    // create token
    const token = createJSONWebToken(tokenPayload, dev.app.jwtUserActivationKey, '10m')

    // create email data with url and token
    const emailData = {
      email: email,
      subject: 'Account activation link',
      html: `
        <h1>Hello ${name}</h1>
        <p>Please activate your account by :
        <a href="http://localhost:8080/users/activate/${token}">
        Click here to activate your account</a></p>
        <hr />
        <p>This activation link expires in 10 minutes</p>`,
    }

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
    const isUserExists = await User.exists({ email: email })
    if (!isUserExists) {
      throw createHTTPError(404, 'User not found')
    }
    const tokenPayload = {
      email: email,
    }
    // create token
    const token = createJSONWebToken({ email }, dev.app.jwtUserActivationKey, '10m')
    // create email data with url and token
    const emailData = {
      email: email,
      subject: 'Reset password link',
      html: `
          <h1>Hello</h1>
          <p>Please reset your password by :
          <a href="http://localhost:8080/users/reset-password/${token}">
          Click here to reset your password</a></p>`,
    }
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
    if (!token) {
      throw createHTTPError(404, 'Please provide a token')
    }
    const decoded = verifyJSONWebToken(token, dev.app.jwtUserActivationKey) as { email: string }
    if (!decoded) {
      throw createHTTPError(404, 'Invalid token')
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    await User.findOneAndUpdate({ email: decoded.email }, { password: hashedPassword })
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
      message: 'Get all users successfully',
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
      message: 'Get a single user by slug successfully',
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

    const user = await deleteUser(slug)
    res.status(200).json({
      message: 'Delete user by slug successfully',
      payload: user,
    })
  } catch (error) {
    return next(error)
  }
}

// Handling  ban user by id
export const banUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { id } = req.params

    const userUpdated = await updateBanStatusById(id, true)
    res.json({
      message: 'User is banned',
      payload: userUpdated,
    })
  } catch (error) {
    return next(error)
  }
}

// Handling  unban user by id
export const unbannedUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { id } = req.params
    const userUpdated = await updateBanStatusById(id, false)
    res.json({
      message: 'User is unbanned',
      payload: userUpdated,
    })
  } catch (error) {
    return next(error)
  }
}
