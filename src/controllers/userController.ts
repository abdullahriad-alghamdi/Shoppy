/*======= External Dependencies and Modules =======*/
import { NextFunction, Request, Response } from 'express'
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'
import bcrypt from 'bcrypt'

/*======= Internal Modules or Files =======*/
// Models
import User from '../models/userSchema'
// Configuration
import { dev } from '../config'
// Utils
import { createHTTPError } from '../utils/createError'
// Helpers
import { handelSendEmail } from '../helper/sendEmail'

export const processRegisterUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, address, phone } = req.body
    const imagePath = req.file?.path

    const isUserExists = await User.exists({ email: email })

    if (isUserExists) {
      throw createHTTPError(409, 'User already exists')
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const tokenPayload = {
      name: name,
      email: email,
      password: hashedPassword,
      address: address,
      phone: phone,
      imagePath: imagePath,
    }

    // create token
    const token = jwt.sign(tokenPayload, dev.app.jwtUserActivationKey, { expiresIn: '10m' })
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
    next(error)
  }
}

//Handle errors token
export const activateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.body.token
    if (!token) {
      throw createHTTPError(404, 'Please provide a token')
    }

    const decoded = jwt.verify(token, dev.app.jwtUserActivationKey)
    if (!decoded) {
      throw createHTTPError(404, 'Invalid token')
    }
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
