/*======= External Dependencies and Modules =======*/
import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

/*======= Internal Modules or Files =======*/
// Models
import User from '../models/userSchema'
// Configuration
import { dev } from '../config/index'
// Utils
import { createHTTPError } from '../utils/createError'
import { handelSendEmail } from '../helper/sendEmail'

export const processRegisterUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //Get the user data
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

    // Generating token
    const token = jwt.sign(tokenPayload, dev.app.jwtUserActivationKey, { expiresIn: '10m' })

    // send email -> Token in email
    const emailData = {
      email: email,
      subject: 'Account activation link',
      html: `
        <h1>Hello ${name}</h1>
        <p>Please activate your account by :
        <a href="http://localhost:8080/users/activate/${token}>
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
