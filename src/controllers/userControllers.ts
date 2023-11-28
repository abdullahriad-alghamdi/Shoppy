/*======= External Dependencies and Modules =======*/
import { NextFunction, Request, Response } from 'express'
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { Error } from 'mongoose'
import slugify from 'slugify'

/*======= Internal Modules or Files =======*/
// Models
import User from '../models/userSchema'

// Types
import { userUpdateType } from '../types/userTypes'

// Configuration
import { dev } from '../config'

// Utils
import { generateToken, verifyToken } from '../utils/token'
import { createHTTPError } from '../utils/createError'

// Helpers
import { handelSendEmail } from '../helper/sendEmail'
// Services
import {
  deleteUser,
  createNewUser,
  findUser,
  paginateUsers,
  updateUser,
  unbannedUserById,
  banUserById,
} from '../services/userServices'

import { replaceImage } from '../services/productServices'

// Get: /users -> Get all users
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.query

    let page = Number(data.page) || undefined
    const limit = Number(data.limit) || undefined
    const search = data.search as string

    const { users, totalPages, currentPage } = await paginateUsers(page, limit, search)

    res.status(200).json({
      message: 'Get all users successfully',
      payload: users,
      totalPages,
      currentPage,
    })
  } catch (error) {
    next(error)
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
  } catch (err) {
    if (err instanceof Error.ValidationError) {
      const errorMessages = Object.values(err.errors).map((err) => err.message)
      res.status(400).json({ errors: errorMessages })
      next(createHTTPError(400, errorMessages.join(', ')))
    } else {
      next(err)
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
      message: 'User created successfully',
      payload: user,
    })
  } catch (error) {
    if (error instanceof Error.ValidationError) {
      const errorMessages = Object.values(error.errors).map((err) => err.message)
      res.status(400).json({ errors: errorMessages })
      next(createHTTPError(400, errorMessages.join(', ')))
    } else {
      next(error)
    }
  }
}

// Put: /users/:slug -> Update user
export const updateUserBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { params, body, file } = req
    const { slug } = params
    const data = body

    replaceImage(file, slug, data)

    const user: userUpdateType = await updateUser(slug, data)

    if (!user) {
      throw createHTTPError(404, 'User not found')
    }

    res.status(200).json({
      message: 'Update user by slug successfully',
      payload: user,
    })
  } catch (error) {
    if (error instanceof Error.ValidationError) {
      const errorMessages = Object.values(error.errors).map((err) => err.message)
      res.status(400).json({ errors: errorMessages })
      next(createHTTPError(400, errorMessages.join(', ')))
    } else {
      next(error)
    }
  }
}

// Delete : /users/:slug -> delete product by slug
export const deleteUserBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params

    const user = await deleteUser(slug)
    res.json({
      message: 'Delete user by slug successfully',
      payload: user,
    })
  } catch (error) {
    next(error)
  }
}

// Create user and sending email with activation link
export const processRegisterUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, name, email, password, address, phone } = req.body
    const imagePath = req.file?.path

    const isUserExists = await User.exists({ email: email })

    if (isUserExists) {
      throw createHTTPError(409, 'User already exists')
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const RegistrationTokenPayload = {
      username,
      name: name,
      email: email,
      password: hashedPassword,
      address: address,
      phone: phone,
      imagePath: imagePath,
      slug: username && typeof username === 'string' ? slugify(username, { lower: true }) : '',
    }

    // create token
    const token = generateToken(RegistrationTokenPayload)

    // create email data with url and token
    const emailData = {
      email: email,
      subject: 'Account activation link',
      html: `
        <h1>Hello ${name}</h1>
        <p>Please activate your account by :
        <a href="http://localhost:8080/users/activate/${token}">
        Click here to activate your account</a></p>`,
    }

    // send email
    await handelSendEmail(emailData)

    res.status(200).json({
      message: 'Check your email to verify your account',
      token: token,
    })
  } catch (error) {
    if (error instanceof Error.ValidationError) {
      const errorMessages = Object.values(error.errors).map((err) => err.message)
      res.status(400).json({ errors: errorMessages })
      next(createHTTPError(400, errorMessages.join(', ')))
    } else {
      next(error)
    }
  }
}

// Activating user and saving to database
export const activateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.body.token
    if (!token) {
      throw createHTTPError(404, 'Please provide a token')
    }

    const decoded = verifyToken(token) as string
    if (!decoded) {
      throw createHTTPError(404, 'Invalid token')
    }

    console.log(decoded)
    await User.create(decoded)

    res.status(201).json({
      message: 'user registered successfully',
      payload: decoded,
    })
  } catch (error) {
    if (error instanceof TokenExpiredError || error instanceof JsonWebTokenError) {
      const errorMessage =
        error instanceof TokenExpiredError ? 'Token has expired' : 'Invalid token'
      next(createHTTPError(401, errorMessage))
    } else {
      next(error)
    }
  }
}

// Handling forgot password
export const processResetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body
    const isUserExists = await User.exists({ email: email })
    if (!isUserExists) {
      throw createHTTPError(404, 'User not found')
    }
    const ResetPasswordTokenPayload = {
      email: email,
    }
    // create token
    const token = jwt.sign(ResetPasswordTokenPayload, dev.app.jwtUserAccessKey, { expiresIn: '1h' })
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
      const errorMessages = Object.values(error.errors).map((err) => err.message)
      res.status(400).json({ errors: errorMessages })
      next(createHTTPError(400, errorMessages.join(', ')))
    } else {
      next(error)
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
    const decoded = jwt.verify(token, dev.app.jwtUserAccessKey) as { email: string }
    if (!decoded) {
      throw createHTTPError(404, 'Invalid token')
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    await User.findOneAndUpdate({ email: decoded.email }, { password: hashedPassword })
    res.status(201).json({
      message: 'Password updated successfully',
    })
  } catch (error) {
    if (error instanceof TokenExpiredError || error instanceof JsonWebTokenError) {
      const errorMessage =
        error instanceof TokenExpiredError ? 'Token has expired' : 'Invalid token'
      next(createHTTPError(401, errorMessage))
    } else {
      next(error)
    }
  }
}

// Handling  ban user by id
export const banUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userUpdated = await banUserById(req.params.id)
    res.json({
      message: ' user banned',
      payload: userUpdated,
    })
  } catch (err) {
    next(err)
  }
}

// Handling  unban user by id
export const unbannedUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userUpdated = await unbannedUserById(req.params.id)
    res.json({
      message: ' user unbanned',
      payload: userUpdated,
    })
  } catch (err) {
    next(err)
  }
}
